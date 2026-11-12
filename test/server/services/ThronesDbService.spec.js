import ThronesDbService, {
    toThronetekiDeck,
    unknownCardCodes
} from '../../../server/services/ThronesDbService.js';
import User from '../../../server/models/User.js';

const cards = {
    '01001': { code: '01001', type: 'plot' },
    '01027': { code: '01027', type: 'agenda' },
    '01198': { code: '01198', type: 'agenda' },
    '06018': { code: '06018', type: 'agenda' },
    '01028': { code: '01028', type: 'character' },
    '01035': { code: '01035', type: 'location' }
};

function thronesDbDeck(overrides = {}) {
    return {
        id: 12,
        uuid: 'a6e3b2a0-0000-4000-8000-000000000001',
        name: 'Winter is Coming',
        faction_code: 'stark',
        agendas: ['01027'],
        slots: { '01027': 1, '01001': 1, '01028': 3, '01035': 2 },
        date_update: '2026-11-01T10:00:00+00:00',
        ...overrides
    };
}

function jsonResponse(status, body) {
    return {
        ok: status >= 200 && status < 300,
        status,
        text: async () => JSON.stringify(body),
        json: async () => body
    };
}

describe('ThronesDbService', function () {
    describe('toThronetekiDeck', function () {
        it('splits plots from draw cards and leaves agendas out of the slots', function () {
            const deck = toThronetekiDeck(thronesDbDeck(), cards);

            expect(deck).toEqual(
                expect.objectContaining({
                    name: 'Winter is Coming',
                    faction: 'stark',
                    agenda: '01027',
                    bannerCards: [],
                    plotCards: [{ cardcode: '01001', count: 1 }],
                    drawCards: [
                        { cardcode: '01028', count: 3 },
                        { cardcode: '01035', count: 2 }
                    ],
                    format: 'joust',
                    variant: 'standard',
                    thronesDbUuid: 'a6e3b2a0-0000-4000-8000-000000000001'
                })
            );
            expect(deck.lastUpdated).toEqual(new Date('2026-11-01T10:00:00Z'));
        });

        it('makes Alliance the agenda and the other agendas banners', function () {
            const deck = toThronetekiDeck(thronesDbDeck({ agendas: ['01198', '06018'] }), cards);

            expect(deck.agenda).toBe('06018');
            expect(deck.bannerCards).toEqual(['01198']);
        });

        it('rejects a deck with cards that are not in the card data', function () {
            const deck = thronesDbDeck({ agendas: ['99999'], slots: { '01028': 1, 99998: 2 } });

            expect(unknownCardCodes(deck, cards)).toEqual(['99999', '99998']);
            expect(toThronetekiDeck(deck, cards)).toBeUndefined();
        });

        it('rejects a deck from an unknown faction', function () {
            expect(toThronetekiDeck(thronesDbDeck({ faction_code: 'neutral' }), cards)).toBe(
                undefined
            );
        });
    });

    describe('tokens', function () {
        beforeEach(function () {
            this.userService = {
                updateUserFields: vi.fn().mockResolvedValue(),
                getUserByUsername: vi.fn().mockResolvedValue(undefined)
            };
            this.service = new ThronesDbService(
                'client',
                'secret',
                'http://localhost/thronesdb',
                this.userService
            );
            this.fetch = vi.spyOn(globalThis, 'fetch');
        });

        afterEach(function () {
            vi.restoreAllMocks();
        });

        it('builds an authorize url with the state and callback', function () {
            const url = new URL(this.service.getAuthorizeUrl('abc'));

            expect(url.origin + url.pathname).toBe('https://thronesdb.com/oauth/v2/auth');
            expect(Object.fromEntries(url.searchParams)).toEqual({
                client_id: 'client',
                response_type: 'code',
                redirect_uri: 'http://localhost/thronesdb',
                scope: 'read_deck',
                state: 'abc'
            });
        });

        it('reads the link from a stored user', function () {
            const linked = new User({ username: 'Stark', thronesDb: { refreshToken: 'r' } });
            const unlinked = new User({ username: 'Lannister' });

            expect(this.service.getStatus(linked)).toEqual({ linked: true, needsRelink: false });
            expect(this.service.getStatus(unlinked)).toEqual({
                linked: false,
                needsRelink: false
            });
        });

        it('leaves the tokens out of the user details sent to admins', function () {
            const user = new User({
                username: 'Stark',
                thronesDb: { refreshToken: 'r' },
                patreon: { access_token: 'pa', refresh_token: 'pr' },
                activationTokenHash: 'ah',
                resetTokenHash: 'rh',
                tokens: [{ _id: 't1', token: 'secret', ip: '10.0.0.1', exp: 1, lastUsed: 2 }]
            });

            const details = user.getFullDetails();

            expect(details.thronesDb).toBeUndefined();
            expect(details.patreon).toBeUndefined();
            expect(details.activationTokenHash).toBeUndefined();
            expect(details.resetTokenHash).toBeUndefined();
            expect(details.tokens).toEqual([{ _id: 't1', ip: '10.0.0.1', exp: 1, lastUsed: 2 }]);
        });

        it('stores the tokens when linking', async function () {
            this.fetch.mockResolvedValue(
                jsonResponse(200, { access_token: 'a', refresh_token: 'r', expires_in: 3600 })
            );

            expect(await this.service.linkAccount('Stark', 'code')).toBe(true);

            const body = this.fetch.mock.calls[0][1].body;
            expect(body.get('grant_type')).toBe('authorization_code');
            expect(body.get('code')).toBe('code');
            expect(body.get('redirect_uri')).toBe('http://localhost/thronesdb');
            expect(this.userService.updateUserFields).toHaveBeenCalledWith(
                { username: 'Stark' },
                {
                    thronesDb: expect.objectContaining({ accessToken: 'a', refreshToken: 'r' })
                }
            );
        });

        it('uses an unexpired access token without refreshing', async function () {
            this.fetch.mockResolvedValue(jsonResponse(200, [thronesDbDeck()]));
            const user = {
                username: 'Stark',
                thronesDb: {
                    accessToken: 'a',
                    refreshToken: 'r',
                    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
                }
            };

            expect(await this.service.getDecks(user)).toHaveLength(1);
            expect(this.fetch).toHaveBeenCalledTimes(1);
            expect(this.fetch.mock.calls[0][1].headers.Authorization).toBe('Bearer a');
        });

        it('refreshes an expired access token before fetching decks', async function () {
            this.fetch
                .mockResolvedValueOnce(
                    jsonResponse(200, { access_token: 'a2', refresh_token: 'r2', expires_in: 3600 })
                )
                .mockResolvedValueOnce(jsonResponse(200, []));
            const user = {
                username: 'Stark',
                thronesDb: { accessToken: 'a', refreshToken: 'r', expiresAt: new Date(0) }
            };

            expect(await this.service.getDecks(user)).toEqual([]);
            expect(this.fetch.mock.calls[0][1].body.get('refresh_token')).toBe('r');
            expect(this.fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer a2');
            expect(user.thronesDb.refreshToken).toBe('r2');
        });

        it('marks the link for relinking when ThronesDB rejects the refresh token', async function () {
            this.fetch.mockResolvedValue(jsonResponse(400, { error: 'invalid_grant' }));
            const user = {
                username: 'Stark',
                thronesDb: { accessToken: 'a', refreshToken: 'r', expiresAt: new Date(0) }
            };

            expect(await this.service.getDecks(user)).toBeUndefined();
            expect(this.service.getStatus(user)).toEqual({ linked: true, needsRelink: true });
            expect(this.userService.updateUserFields).toHaveBeenCalledWith(
                { username: 'Stark' },
                { thronesDb: expect.objectContaining({ relinkRequired: true }) }
            );
        });

        it('keeps the link when ThronesDB fails with a server error', async function () {
            this.fetch.mockResolvedValue({
                ok: false,
                status: 503,
                text: async () => '<html>Down for maintenance</html>'
            });
            const user = {
                username: 'Stark',
                thronesDb: { accessToken: 'a', refreshToken: 'r', expiresAt: new Date(0) }
            };

            expect(await this.service.getDecks(user)).toBeUndefined();
            expect(this.service.getStatus(user)).toEqual({ linked: true, needsRelink: false });
            expect(this.userService.updateUserFields).not.toHaveBeenCalled();
        });

        it('shares one token refresh between concurrent requests', async function () {
            this.fetch.mockImplementation(async (url) =>
                url.includes('/oauth/v2/token')
                    ? jsonResponse(200, {
                          access_token: 'a2',
                          refresh_token: 'r2',
                          expires_in: 3600
                      })
                    : jsonResponse(200, [])
            );
            const expired = () => ({
                username: 'Stark',
                thronesDb: { accessToken: 'a', refreshToken: 'r', expiresAt: new Date(0) }
            });

            await Promise.all([this.service.getDecks(expired()), this.service.getDecks(expired())]);

            const tokenCalls = this.fetch.mock.calls.filter(([url]) =>
                url.includes('/oauth/v2/token')
            );
            expect(tokenCalls).toHaveLength(1);
            expect(this.userService.updateUserFields).toHaveBeenCalledTimes(1);
        });

        it('uses tokens another process stored when its refresh token was already used', async function () {
            this.fetch
                .mockResolvedValueOnce(jsonResponse(400, { error: 'invalid_grant' }))
                .mockResolvedValueOnce(jsonResponse(200, []));
            this.userService.getUserByUsername.mockResolvedValue({
                thronesDb: {
                    accessToken: 'a2',
                    refreshToken: 'r2',
                    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
                }
            });
            const user = {
                username: 'Stark',
                thronesDb: { accessToken: 'a', refreshToken: 'r', expiresAt: new Date(0) }
            };

            expect(await this.service.getDecks(user)).toEqual([]);
            expect(this.fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer a2');
            expect(this.service.getStatus(user)).toEqual({ linked: true, needsRelink: false });
            expect(this.userService.updateUserFields).not.toHaveBeenCalled();
        });

        it('keeps the link when the refresh fails to reach ThronesDB', async function () {
            this.fetch.mockRejectedValue(new TypeError('fetch failed'));
            const user = {
                username: 'Stark',
                thronesDb: { accessToken: 'a', refreshToken: 'r', expiresAt: new Date(0) }
            };

            expect(await this.service.getDecks(user)).toBeUndefined();
            expect(this.service.getStatus(user)).toEqual({ linked: true, needsRelink: false });
            expect(this.userService.updateUserFields).not.toHaveBeenCalled();
        });
    });
});
