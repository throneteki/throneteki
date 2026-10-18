import crypto from 'crypto';
import db, { resetDatabase } from '../helpers/database.js';
import { copyFromMongo } from '../../../../server/scripts/mongo-to-postgres/copy.js';
import CardService from '../../../../server/services/CardService.js';
import DeckService from '../../../../server/services/DeckService.js';
import EventService from '../../../../server/services/EventService.js';
import GameService from '../../../../server/services/GameService.js';
import MessageService from '../../../../server/services/MessageService.js';
import UserService from '../../../../server/services/UserService.js';
import AbuseService from '../../../../server/services/AbuseService.js';

const hmacSecret = 'test-secret';

function objectId(n) {
    return n.toString(16).padStart(24, '0');
}

function refreshToken(username, id) {
    return crypto
        .createHmac('sha512', hmacSecret)
        .update(`REFRESH ${username} ${id}`)
        .digest('hex');
}

function valuesAt(doc, path) {
    return path
        .split('.')
        .reduce(
            (values, key) =>
                values.flatMap((value) =>
                    value === null || value === undefined
                        ? []
                        : Array.isArray(value[key])
                          ? value[key]
                          : [value[key]]
                ),
            [doc]
        );
}

function matches(doc, query) {
    return Object.entries(query).every(([field, condition]) => {
        const values = valuesAt(doc, field);

        if (condition && typeof condition === 'object' && '$gte' in condition) {
            return values.some((value) => value >= condition.$gte);
        }

        if (condition && typeof condition === 'object' && '$in' in condition) {
            return values.some((value) => condition.$in.includes(value));
        }

        return values.some((value) => value === condition);
    });
}

function fakeSource(collections) {
    return {
        count: async (name, query) =>
            (collections[name] || []).filter((doc) => matches(doc, query)).length,
        async *batches(name, query, size) {
            const docs = (collections[name] || []).filter((doc) => matches(doc, query));

            for (let i = 0; i < docs.length; i += size) {
                yield structuredClone(docs.slice(i, i + size));
            }
        }
    };
}

function mongoData() {
    const tokenId = objectId(900);

    return {
        users: [
            {
                _id: objectId(1),
                username: 'Stark',
                email: 'ned@winterfell.example',
                password: 'hash',
                registered: new Date('2020-01-01T00:00:00Z'),
                verified: true,
                settings: { cardSize: 'large' },
                permissions: { isAdmin: true, canFly: true },
                blockList: ['Lannister', 'lannister'],
                registerIp: '::ffff:203.0.113.10',
                registerSubnet: '203.0.113.0/24',
                trustState: 'mystery',
                activationTokenExpiry: '20200102-10:00:00',
                tokens: [
                    {
                        _id: tokenId,
                        token: refreshToken('Stark', tokenId),
                        exp: new Date(Date.now() + 86400000),
                        ip: '203.0.113.10',
                        lastUsed: new Date()
                    },
                    { _id: objectId(901), token: 'no-expiry' }
                ],
                favouriteColour: 'grey'
            },
            {
                _id: objectId(2),
                username: 'STARK',
                email: 'other@example.com',
                password: 'hash'
            },
            {
                _id: objectId(3),
                username: 'Lannister',
                email: 'tywin@casterly.example',
                password: 'hash'
            },
            { _id: objectId(4), username: 'NoEmail', password: 'hash' },
            { _id: objectId(5), username: 'Lannister', email: 'copy@casterly.example' },
            {
                _id: objectId(6),
                username: 'Snow',
                email: 'NED@winterfell.example',
                password: 'hash',
                registered: new Date('2017-01-01T00:00:00Z')
            },
            {
                _id: objectId(7),
                username: 'Tully',
                email: 'Tywin@Casterly.example',
                password: 'hash',
                registered: new Date('2018-01-01T00:00:00Z')
            }
        ],
        banlist: [{ _id: objectId(10), ip: '198.51.100.1', user: 'Stark', added: new Date() }],
        abuse_blocks: [
            {
                _id: objectId(20),
                scope: 'subnet',
                value: '2001:0db8:0000:0000::/64',
                sourceUserId: objectId(3),
                createdAt: new Date(),
                active: true
            },
            { _id: objectId(21), scope: 'planet', value: 'mars' }
        ],
        abuse_events: [
            {
                _id: objectId(30),
                type: 'login_attempt',
                username: 'Stark',
                userId: objectId(1),
                ip: '::ffff:203.0.113.10',
                signals: ['shared exact ip'],
                createdAt: new Date('2026-01-01T00:00:00Z')
            },
            {
                _id: objectId(31),
                type: 'registration_attempt',
                createdAt: new Date('2026-06-01T00:00:00Z')
            }
        ],
        events: [
            {
                _id: objectId(40),
                name: 'Tournament',
                format: 'joust',
                variant: 'standard',
                legality: 'latest',
                restrictTableCreators: false
            }
        ],
        draftCubes: [{ _id: objectId(50), name: 'Cube', packDefinitions: [] }],
        decks: [
            {
                _id: objectId(60),
                username: 'Stark',
                name: 'Old style',
                faction: { name: 'House Stark', value: 'stark' },
                agenda: { code: '01027', label: 'Fealty' },
                plotCards: [{ card: { code: '01001' }, count: 1 }],
                drawCards: [{ card: { code: '01028' }, count: 3 }],
                bannerCards: [{ code: '01198' }],
                eventId: objectId(40),
                lastUpdated: new Date('2025-01-01T00:00:00Z')
            },
            {
                _id: objectId(61),
                username: 'stark',
                name: 'Second event deck',
                faction: { value: 'stark' },
                plotCards: [{ cardcode: '01001', count: 1 }],
                eventId: objectId(40)
            },
            { _id: objectId(62), username: 'Ghost', name: 'Orphan', faction: { value: 'stark' } },
            {
                _id: objectId(64),
                username: 'STARK',
                name: 'Duplicate owner',
                faction: { value: 'stark' }
            },
            {
                _id: objectId(65),
                username: 'Lannister',
                name: 'Shared name',
                faction: { value: 'lannister' }
            },
            {
                _id: objectId(63),
                standaloneDeckId: 'SD-1',
                name: 'Standalone',
                faction: { value: 'targaryen' },
                drawCards: [{ cardcode: '01028', count: 2 }]
            }
        ],
        games: [
            {
                _id: objectId(70),
                gameId: 'game-1',
                startedAt: new Date('2026-01-01T00:00:00Z'),
                winner: 'Stark',
                players: [
                    { name: 'Stark', faction: 'stark', agenda: 'Fealty', power: 15 },
                    { name: 'Lannister', faction: 'lannister', agendas: ['Banner of the Lion'] }
                ]
            },
            { _id: objectId(71), gameId: 'game-1', startedAt: new Date('2026-06-01T00:00:00Z') },
            {
                _id: objectId(72),
                gameId: 'game-2',
                startedAt: new Date('2026-09-01T00:00:00Z'),
                players: [{ name: 'Tully', faction: 'tyrell', agenda: 'Fealty' }]
            }
        ],
        messages: [
            {
                _id: objectId(80),
                user: { username: 'Stark', name: 'Stark', role: 'admin' },
                message: 'Hello',
                time: new Date('2026-01-01T00:00:00Z')
            },
            {
                _id: objectId(81),
                type: 'motd',
                message: 'Welcome',
                motdType: 'info',
                user: { username: 'Stark' },
                time: new Date()
            }
        ],
        news: [{ _id: objectId(90), poster: 'Stark', text: 'News', datePublished: new Date() }]
    };
}

describe('copyFromMongo', function () {
    beforeEach(async function () {
        await resetDatabase();

        this.data = mongoData();
        this.report = await copyFromMongo({ source: fakeSource(this.data), db, batchSize: 2 });

        const configService = {
            getValue: (key) => ({ hmacSecret, refreshTokenRetentionDays: 30 })[key]
        };
        this.userService = new UserService(configService);
        this.eventService = new EventService();
        this.deckService = new DeckService(new CardService(), this.eventService);
    });

    it('should copy users, skipping and reporting the ones that cannot be copied', async function () {
        expect(this.report.users.copied).toBe(4);
        expect(this.report.users.skipped).toEqual({
            'username clashes, once case is ignored, with an account that was used more recently': {
                count: 2,
                examples: [objectId(2), objectId(5)]
            },
            'email shared with an account that was used more recently, and not used in five years':
                {
                    count: 1,
                    examples: [objectId(6)]
                }
        });
        expect(Object.keys(this.report.users.issues).sort()).toEqual([
            'dropped invalid refresh token',
            'email shared with an account that was used more recently, removed',
            'no registered date',
            'unknown permission canFly',
            'unknown trustState mystery'
        ]);
    });

    it('should keep the email on the account used most recently', async function () {
        const tully = (await this.userService.getUserByUsername('Tully')).getDetails();
        const lannister = (await this.userService.getUserByUsername('Lannister')).getDetails();

        expect(tully.email).toBe('Tywin@Casterly.example');
        expect(lannister.email).toBeUndefined();
        expect(lannister.removedDuplicateEmail).toBe('tywin@casterly.example');
        expect(await this.userService.getUserByUsername('Snow')).toBeUndefined();
    });

    it('should carry the user over so the lobby sees the same details', async function () {
        const user = await this.userService.getUserByUsername('stark');
        const details = user.getDetails();

        expect(user.permissions).toEqual({ isAdmin: true });
        expect(user.blockList).toEqual(['lannister']);
        expect(user.trustState).toBe('trusted');
        expect(details.settings.cardSize).toBe('large');
        expect(details.registerIp).toBe('::ffff:203.0.113.10');
        expect(details.favouriteColour).toBe('grey');
        expect(user.activationTokenExpiry).toEqual(new Date('2020-01-02T10:00:00'));
        expect(await this.userService.getUserById(objectId(1))).toBeTruthy();
    });

    it('should keep refresh tokens working, so users stay logged in', async function () {
        const user = await this.userService.getUserByUsername('Stark');
        const token = user.tokens.find((t) => t._id === objectId(900));

        expect(
            this.userService.verifyRefreshToken(
                'Stark',
                token,
                refreshToken('Stark', objectId(900))
            )
        ).toBe(true);
    });

    it('should copy decks as card pointers and keep event locks', async function () {
        const [event] = await this.eventService.getEvents();
        const deck = await this.deckService.getById(objectId(60));

        expect(deck).toEqual(
            jasmine.objectContaining({
                username: 'Stark',
                agenda: '01027',
                plotCards: [{ cardcode: '01001', count: 1 }],
                drawCards: [{ cardcode: '01028', count: 3 }],
                bannerCards: ['01198'],
                eventId: event._id,
                locked: true
            })
        );

        expect((await this.deckService.getById(objectId(61))).locked).toBe(false);
        expect(
            this.report.decks.issues['second deck for the same event, deck unlocked'].count
        ).toBe(1);
        expect(this.report.decks.skipped['owner not found'].examples).toEqual([objectId(62)]);
        expect(
            this.report.decks.skipped['owner was a duplicate account that was not copied'].examples
        ).toEqual([objectId(64)]);
        expect((await this.deckService.getById(objectId(65))).username).toBe('Lannister');
        expect((await this.deckService.getByStandaloneId('SD-1')).drawCards).toEqual([
            { cardcode: '01028', count: 2 }
        ]);
    });

    it('should copy events, keeping fields with no column', async function () {
        const event = await this.eventService.getEventById(objectId(40));

        expect(event.name).toBe('Tournament');
        expect(event.restrictTableCreators).toBe(false);
    });

    it('should copy games with their players and skip duplicate game ids', async function () {
        const [game] = await new GameService().getAllGames();

        expect(game.winner).toBe('Stark');
        expect(game.players[0]).toEqual(
            jasmine.objectContaining({ name: 'Stark', agenda: 'Fealty', power: 15 })
        );
        expect(game.players[1].agendas).toEqual(['Banner of the Lion']);
        expect(this.report.games.skipped['game id is already used by an earlier game'].count).toBe(
            1
        );
    });

    it('should copy chat, the message of the day and news', async function () {
        const messageService = new MessageService();

        expect((await messageService.getLastMessages(false)).map((m) => m.message)).toEqual([
            'Hello'
        ]);
        expect((await messageService.getMotdMessage())[0].message).toBe('Welcome');
        expect((await db.query('SELECT text FROM news'))[0].text).toBe('News');
    });

    it('should copy moderation data with addresses normalised', async function () {
        const abuseService = new AbuseService({ getValue: () => hmacSecret }, this.userService);

        const blocks = await abuseService.getMatchingBlocks({ subnet: '2001:db8::/64' });
        expect(blocks.map((block) => block.value)).toEqual(['2001:db8::/64']);
        expect(this.report.abuse_blocks.skipped['unknown scope planet'].count).toBe(1);

        const user = await this.userService.getUserByUsername('Stark');
        const [event] = await abuseService.getRecentEventsForUser(user.getDetails());
        expect(event.ip).toBe('203.0.113.10');
        expect(event.userId).toBe(user._id);

        expect((await db.query('SELECT ip FROM banlist'))[0].ip).toBe('198.51.100.1');
    });

    it('should give the same result when run again', async function () {
        const before = await db.query(
            'SELECT (SELECT count(*) FROM users) u, (SELECT count(*) FROM refresh_tokens) t, (SELECT count(*) FROM decks) d, (SELECT count(*) FROM deck_cards) c, (SELECT count(*) FROM game_players) p, (SELECT count(*) FROM abuse_events) e'
        );

        this.data.users[0].settings = { cardSize: 'small' };
        await copyFromMongo({ source: fakeSource(this.data), db });

        const after = await db.query(
            'SELECT (SELECT count(*) FROM users) u, (SELECT count(*) FROM refresh_tokens) t, (SELECT count(*) FROM decks) d, (SELECT count(*) FROM deck_cards) c, (SELECT count(*) FROM game_players) p, (SELECT count(*) FROM abuse_events) e'
        );
        expect(after).toEqual(before);
        expect(
            (await this.userService.getUserByUsername('Stark')).getDetails().settings.cardSize
        ).toBe('small');
    });

    it('should only copy games and abuse events from --since', async function () {
        await resetDatabase();

        const report = await copyFromMongo({
            source: fakeSource(this.data),
            db,
            collections: ['users', 'games', 'abuse_events'],
            since: new Date('2026-03-01T00:00:00Z')
        });

        expect(report.games.read).toBe(2);
        expect(report.abuse_events.read).toBe(1);
        expect(report.users.read).toBe(7);
    });
});
