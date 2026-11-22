import logger from '../log.js';
import { Factions } from './DeckService.js';

const ThronesDbUrl = 'https://thronesdb.com';
const AuthorizeUrl = `${ThronesDbUrl}/oauth/v2/auth`;
const TokenUrl = `${ThronesDbUrl}/oauth/v2/token`;
const DecksUrl = `${ThronesDbUrl}/api/oauth2/decks`;
const AllianceCode = '06018';
const ExpiryMarginMs = 60 * 1000;

class TokenRequestError extends Error {
    constructor(status, payload) {
        super(`ThronesDB token request failed with status ${status}`);
        this.payload = payload;
        // OAuth servers answer a revoked, expired or already used grant with 400 or 401
        this.rejected = status === 400 || status === 401;
    }
}

export function unknownCardCodes(thronesDbDeck, cards) {
    const codes = [...(thronesDbDeck.agendas || []), ...Object.keys(thronesDbDeck.slots || {})];

    return [...new Set(codes.filter((code) => !cards[code]))];
}

export function toThronetekiDeck(thronesDbDeck, cards) {
    if (!Factions.some((faction) => faction.value === thronesDbDeck.faction_code)) {
        return undefined;
    }

    if (unknownCardCodes(thronesDbDeck, cards).length > 0) {
        return undefined;
    }

    const agendas = thronesDbDeck.agendas || [];
    let agenda = agendas[0];
    let bannerCards = [];

    if (agendas.includes(AllianceCode)) {
        agenda = AllianceCode;
        bannerCards = agendas.filter((code) => code !== AllianceCode);
    }

    const plotCards = [];
    const drawCards = [];

    for (const [code, count] of Object.entries(thronesDbDeck.slots || {})) {
        const card = cards[code];
        if (card.type === 'agenda') {
            continue;
        }

        (card.type === 'plot' ? plotCards : drawCards).push({ cardcode: code, count });
    }

    return {
        name: thronesDbDeck.name || 'ThronesDB deck',
        faction: thronesDbDeck.faction_code,
        agenda,
        bannerCards,
        plotCards,
        drawCards,
        format: 'joust',
        variant: 'standard',
        thronesDbUuid: thronesDbDeck.uuid,
        lastUpdated: thronesDbDeck.date_update ? new Date(thronesDbDeck.date_update) : new Date()
    };
}

class ThronesDbService {
    constructor(clientId, secret, callbackUrl, userService) {
        this.clientId = clientId;
        this.secret = secret;
        this.callbackUrl = callbackUrl;
        this.userService = userService;
        this.refreshes = new Map();
    }

    isConfigured() {
        return !!(this.clientId && this.secret && this.callbackUrl);
    }

    getAuthorizeUrl(state) {
        const params = new URLSearchParams({
            client_id: this.clientId,
            response_type: 'code',
            redirect_uri: this.callbackUrl,
            scope: 'read_deck',
            state
        });

        return `${AuthorizeUrl}?${params.toString()}`;
    }

    getStatus(user) {
        const thronesDb = user.thronesDb;

        return {
            linked: !!thronesDb?.refreshToken,
            needsRelink: !!thronesDb?.relinkRequired
        };
    }

    async linkAccount(username, code) {
        let tokens;

        try {
            tokens = await this.requestTokens({
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.callbackUrl
            });
        } catch (err) {
            logger.error('Error linking thronesdb account %s %s', err, JSON.stringify(err.payload));
            return false;
        }

        return this.saveTokens(username, tokens);
    }

    async unlinkAccount(username) {
        return this.saveTokens(username, null);
    }

    async getDecks(user) {
        let accessToken = await this.getAccessToken(user);
        if (!accessToken) {
            return undefined;
        }

        let response = await this.fetchDecks(accessToken);
        if (response?.status === 401) {
            accessToken = await this.refreshTokens(user);
            response = accessToken && (await this.fetchDecks(accessToken));
        }

        if (!response?.ok) {
            return undefined;
        }

        return response.json();
    }

    async fetchDecks(accessToken) {
        try {
            return await fetch(DecksUrl, {
                headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' }
            });
        } catch (err) {
            logger.error('Error fetching thronesdb decks %s', err);
            return undefined;
        }
    }

    async getAccessToken(user) {
        const thronesDb = user.thronesDb;
        if (!thronesDb?.refreshToken || thronesDb.relinkRequired) {
            return undefined;
        }

        if (new Date(thronesDb.expiresAt).getTime() - ExpiryMarginMs > Date.now()) {
            return thronesDb.accessToken;
        }

        return this.refreshTokens(user);
    }

    refreshTokens(user) {
        const key = user.username.toLowerCase();
        if (!this.refreshes.has(key)) {
            this.refreshes.set(
                key,
                this.doRefreshTokens(user).finally(() => this.refreshes.delete(key))
            );
        }

        return this.refreshes.get(key).then(({ thronesDb, refreshed }) => {
            user.thronesDb = thronesDb;
            return refreshed ? thronesDb.accessToken : undefined;
        });
    }

    async doRefreshTokens(user) {
        const refreshToken = user.thronesDb.refreshToken;
        let tokens;

        try {
            tokens = await this.requestTokens({
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            });
        } catch (err) {
            if (!err.rejected) {
                logger.error('Error refreshing thronesdb token %s', err);
                return { thronesDb: user.thronesDb, refreshed: false };
            }

            // Another lobby process may have rotated the refresh token first, in which case its
            // tokens are already stored and still good
            const stored = await this.userService
                .getUserByUsername(user.username)
                .then((storedUser) => storedUser?.thronesDb)
                .catch(() => undefined);
            if (stored?.refreshToken && stored.refreshToken !== refreshToken) {
                return { thronesDb: stored, refreshed: !stored.relinkRequired };
            }

            logger.error('ThronesDB rejected the refresh token %s', JSON.stringify(err.payload));
            const thronesDb = { ...user.thronesDb, relinkRequired: true };
            await this.saveTokens(user.username, thronesDb);

            return { thronesDb, refreshed: false };
        }

        if (!(await this.saveTokens(user.username, tokens))) {
            return { thronesDb: user.thronesDb, refreshed: false };
        }

        return { thronesDb: tokens, refreshed: true };
    }

    async requestTokens(params) {
        const response = await fetch(TokenUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.secret,
                ...params
            })
        });

        const text = await response.text();
        let payload;
        try {
            payload = JSON.parse(text);
        } catch {
            payload = { message: text };
        }

        if (!response.ok || !payload.access_token || !payload.refresh_token) {
            throw new TokenRequestError(response.status, payload);
        }

        return {
            accessToken: payload.access_token,
            refreshToken: payload.refresh_token,
            expiresAt: new Date(Date.now() + Number(payload.expires_in || 0) * 1000).toISOString()
        };
    }

    async saveTokens(username, thronesDb) {
        try {
            await this.userService.updateUserFields({ username }, { thronesDb });
        } catch (err) {
            logger.error('Error saving thronesdb tokens %s', err);
            return false;
        }

        return true;
    }
}

export default ThronesDbService;
