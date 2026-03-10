import logger from '../log.js';

const PatreonApiBaseUrl = 'https://www.patreon.com/api/oauth2/v2';
const PatreonTokenUrl = 'https://www.patreon.com/api/oauth2/token';
const BrokenLinkMessage = 'Your Patreon link has expired. Please relink your Patreon account.';

class PatreonService {
    constructor(clientId, secret, userService, callbackUrl) {
        this.clientId = clientId;
        this.secret = secret;
        this.userService = userService;
        this.callbackUrl = callbackUrl;
    }

    async getPatreonStateForUser(user) {
        if (!user?.patreon?.refresh_token) {
            return undefined;
        }

        if (user.patreon.relinkRequired) {
            return this.buildBrokenState(user.patreon.relinkMessage);
        }

        let membershipResult = await this.fetchMembershipStatus(user.patreon.access_token);
        if (membershipResult.success) {
            await this.clearRelinkRequired(user);
            return this.buildState(membershipResult.status);
        }

        if (!membershipResult.relinkRequired) {
            return undefined;
        }

        let refreshedTokens = await this.refreshTokenForUser(user);
        if (!refreshedTokens) {
            return await this.markRelinkRequired(user, BrokenLinkMessage);
        }

        membershipResult = await this.fetchMembershipStatus(refreshedTokens.access_token);
        if (membershipResult.success) {
            return this.buildState(membershipResult.status);
        }

        if (membershipResult.relinkRequired) {
            return await this.markRelinkRequired(user, BrokenLinkMessage);
        }

        return undefined;
    }

    buildState(status) {
        return {
            status,
            connected: true,
            needsRelink: false
        };
    }

    buildBrokenState(message = BrokenLinkMessage) {
        return {
            status: 'broken',
            connected: true,
            needsRelink: true,
            message
        };
    }

    async fetchMembershipStatus(accessToken) {
        let response;

        try {
            response = await fetch(
                `${PatreonApiBaseUrl}/identity?include=memberships&fields%5Bmember%5D=patron_status,last_charge_status,currently_entitled_amount_cents`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/json'
                    }
                }
            );
        } catch (err) {
            logger.error('Error getting patreon status: %s', err);
            return {
                success: false,
                relinkRequired: false
            };
        }

        if (!response.ok) {
            const payload = await this.parseResponsePayload(response);
            logger.error('Error getting patreon status %s', JSON.stringify(payload));

            return {
                success: false,
                relinkRequired: response.status === 401
            };
        }

        const payload = await response.json();
        const memberships = (payload.included || []).filter((item) => item.type === 'member');
        const isPledged = memberships.some((membership) => this.isActivePatron(membership));

        return {
            success: true,
            status: isPledged ? 'pledged' : 'linked'
        };
    }

    isActivePatron(membership) {
        const attributes = membership?.attributes || {};

        return (
            attributes.patron_status === 'active_patron' ||
            Number(attributes.currently_entitled_amount_cents || 0) > 0
        );
    }

    async refreshTokenForUser(user) {
        let response;

        try {
            response = await this.requestTokens({
                grant_type: 'refresh_token',
                refresh_token: user.patreon.refresh_token
            });
        } catch (err) {
            logger.error('Error refreshing patreon account %s', JSON.stringify(err));
            return undefined;
        }

        let userDetails = user.getDetails();
        // eslint-disable-next-line require-atomic-updates
        user.patreon = userDetails.patreon = {
            ...response,
            relinkRequired: false,
            relinkMessage: undefined
        };

        try {
            await this.userService.update(userDetails);
        } catch (err) {
            logger.error(err);
            return undefined;
        }

        return response;
    }

    async linkAccount(username, code) {
        let response;

        try {
            response = await this.requestTokens({
                grant_type: 'authorization_code',
                code,
                redirect_uri: this.callbackUrl
            });
        } catch (err) {
            logger.error('Error linking patreon account %s', JSON.stringify(err));
            return false;
        }

        let user = await this.userService.getUserByUsername(username);
        if (!user) {
            logger.error('Error linking patreon account, user not found');
            return false;
        }

        user.patreon = {
            ...response,
            relinkRequired: false,
            relinkMessage: undefined
        };

        try {
            await this.userService.update(user);
        } catch (err) {
            logger.error(err);
            return false;
        }

        return user;
    }

    async requestTokens(params) {
        const body = new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.secret,
            ...params
        });

        if (!body.get('redirect_uri')) {
            body.append('redirect_uri', this.callbackUrl);
        }

        const response = await fetch(PatreonTokenUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            },
            body
        });

        const payload = await this.parseResponsePayload(response);
        if (!response.ok) {
            throw payload;
        }

        return {
            access_token: payload.access_token,
            refresh_token: payload.refresh_token,
            expires_in: payload.expires_in,
            scope: payload.scope,
            token_type: payload.token_type,
            date: new Date()
        };
    }

    async markRelinkRequired(user, message = BrokenLinkMessage) {
        let userDetails = user.getDetails();
        let patreon = {
            ...(user.patreon || {}),
            relinkRequired: true,
            relinkMessage: message
        };

        // eslint-disable-next-line require-atomic-updates
        user.patreon = userDetails.patreon = patreon;

        try {
            await this.userService.update(userDetails);
        } catch (err) {
            logger.error(err);
        }

        return this.buildBrokenState(message);
    }

    async clearRelinkRequired(user) {
        if (!user?.patreon?.relinkRequired && !user?.patreon?.relinkMessage) {
            return;
        }

        let userDetails = user.getDetails();
        let patreon = {
            ...user.patreon,
            relinkRequired: false,
            relinkMessage: undefined
        };

        // eslint-disable-next-line require-atomic-updates
        user.patreon = userDetails.patreon = patreon;

        try {
            await this.userService.update(userDetails);
        } catch (err) {
            logger.error(err);
        }
    }

    async parseResponsePayload(response) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
            return response.json();
        }

        const text = await response.text();

        try {
            return JSON.parse(text);
        } catch {
            return { message: text };
        }
    }

    async unlinkAccount(username) {
        let dbUser = await this.userService.getUserByUsername(username);
        if (!dbUser) {
            logger.error('Error unlinking patreon account, user not found');
            return false;
        }

        let user = dbUser.getDetails();
        user.patreon = undefined;

        try {
            await this.userService.update(user);
        } catch (err) {
            logger.error(err);
            return false;
        }

        return true;
    }
}

export default PatreonService;
