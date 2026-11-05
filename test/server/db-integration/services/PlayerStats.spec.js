import db, { resetDatabase } from '../helpers/database.js';
import CardService from '../../../../server/services/CardService.js';
import DeckService from '../../../../server/services/DeckService.js';
import EventService from '../../../../server/services/EventService.js';
import GameService from '../../../../server/services/GameService.js';
import UserService from '../../../../server/services/UserService.js';
import UserStatsService from '../../../../server/services/UserStatsService.js';
import WrappedService from '../../../../server/services/WrappedService.js';
import { DominantWinCases } from '../../services/dominantWinCases.js';
import WrappedEmailService, {
    unsubscribeToken
} from '../../../../server/services/WrappedEmailService.js';

const config = {
    getValue: (key) =>
        ({ appName: 'The Iron Throne', origin: 'https://example.test', hmacSecret: 'hmac' })[key] ??
        'test-secret'
};

let gameNumber = 0;

function game({ startedAt, winner = 'Ned', reason = 'power', players, finished = true }) {
    gameNumber++;

    return {
        gameId: `game-${gameNumber}`,
        startedAt: new Date(startedAt),
        finishedAt: finished ? new Date(new Date(startedAt).getTime() + 3600 * 1000) : undefined,
        winner: finished ? winner : undefined,
        winReason: finished ? reason : undefined,
        players: players || [
            { name: 'Ned', faction: 'House Stark', agendas: ['Fealty'], power: 15 },
            { name: 'Cersei', faction: 'House Lannister', agendas: [], power: 9 }
        ]
    };
}

describe('Player stats', function () {
    beforeEach(async function () {
        await resetDatabase();

        this.userService = new UserService(config);
        for (const username of ['Ned', 'Cersei', 'Jon']) {
            await this.userService.addUser({
                username,
                email: `${username.toLowerCase()}@example.test`,
                password: 'hash',
                verified: true
            });
        }

        this.ned = await this.userService.getUserByUsername('Ned');
        this.gameService = new GameService();
        this.statsService = new UserStatsService();

        this.save = async (details) => {
            const saved = game(details);
            await this.gameService.create(saved);
            await this.gameService.update(saved);
        };
    });

    describe('monthly stats', function () {
        beforeEach(async function () {
            await this.save({ startedAt: '2026-09-30T23:30:00Z' });
            await this.save({ startedAt: '2026-10-01T00:30:00Z' });
            await this.save({ startedAt: '2026-10-02T19:00:00Z', winner: 'Cersei' });
            await this.save({ startedAt: '2026-10-03T19:00:00Z', finished: false });
            await this.save({
                startedAt: '2026-10-04T19:00:00Z',
                players: [{ name: 'Ned', faction: 'House Stark', agendas: [], power: 15 }]
            });
            await this.save({
                startedAt: '2026-10-05T19:00:00Z',
                winner: 'Jon',
                players: [
                    { name: 'Ned', faction: 'House Stark', agendas: ['Fealty'], power: 3 },
                    { name: 'Cersei', faction: 'House Lannister', agendas: [], power: 4 },
                    { name: 'Jon', faction: "The Night's Watch", agendas: [], power: 15 }
                ]
            });
        });

        it('should list the months with finished games, newest first', async function () {
            expect(await this.statsService.getMonths(this.ned._id)).toEqual(['2026-10', '2026-09']);
        });

        it('should count finished games against opponents, by UTC month', async function () {
            const stats = await this.statsService.getMonth(
                this.ned._id,
                '2026-10',
                new Date('2026-10-20T00:00:00Z')
            );

            expect(stats.games).toBe(3);
            expect(stats.wins).toBe(1);
            expect(stats.meleeGames).toBe(1);
            expect(stats.byDay['2026-10-01']).toBe(1);
            expect(stats.byHour[0]).toBe(1);
            expect(stats.rival).toEqual({ name: 'Cersei', games: 3, wins: 1, lossesTo: 1 });
            expect(stats.opponentCount).toBe(2);
        });

        it('should cache a month once it is over, and still name opponents as they are now', async function () {
            const now = new Date('2026-11-04T00:00:00Z');
            await this.statsService.getMonth(this.ned._id, '2026-10', now);

            const [cached] = await db.query('SELECT data FROM user_monthly_stats');
            expect(cached.data.games).toBe(3);

            await db.query("UPDATE users SET disabled = true WHERE username = 'Cersei'");
            const stats = await this.statsService.getMonth(this.ned._id, '2026-10', now);

            expect(stats.games).toBe(3);
            expect(stats.rival.name).toBe('Jon');
            expect(JSON.stringify(stats)).not.toContain('Cersei');
        });

        it('should not cache the current month', async function () {
            await this.statsService.getMonth(this.ned._id, '2026-10', new Date('2026-10-20'));

            expect(await db.query('SELECT 1 FROM user_monthly_stats')).toEqual([]);
        });

        it('should not cache a month without games', async function () {
            const stats = await this.statsService.getMonth(this.ned._id, '2026-05', new Date());

            expect(stats.games).toBe(0);
            expect(await db.query('SELECT 1 FROM user_monthly_stats')).toEqual([]);
        });
    });

    describe('deck records', function () {
        beforeEach(async function () {
            const cardService = new CardService();
            await cardService.replaceCards([]);
            await cardService.replacePacks([]);
            this.deckService = new DeckService(cardService, new EventService());
            await this.deckService.init();

            const deck = (username) => ({
                username,
                name: `${username}'s deck`,
                faction: { name: 'House Stark', value: 'stark' },
                bannerCards: [],
                plotCards: [],
                drawCards: []
            });

            this.nedDeck = await this.deckService.create(deck('Ned'));
            this.cerseiDeck = await this.deckService.create(deck('Cersei'));
        });

        it("should only record the deck on a game when it is the player's own", async function () {
            await this.save({
                startedAt: '2026-10-02T19:00:00Z',
                players: [
                    { name: 'Ned', faction: 'House Stark', agendas: [], deckId: this.nedDeck._id },
                    {
                        name: 'Cersei',
                        faction: 'House Stark',
                        agendas: [],
                        deckId: this.nedDeck._id
                    }
                ]
            });

            const rows = await db.query(
                'SELECT name, deck_id, details FROM game_players ORDER BY position'
            );

            expect(rows.map((row) => row.deck_id)).toEqual([Number(this.nedDeck._id), null]);
            expect(rows[0].details.deckId).toBeUndefined();
        });

        it("should show each deck's record from its owner's finished games", async function () {
            const players = () => [
                { name: 'Ned', faction: 'House Stark', agendas: [], deckId: this.nedDeck._id },
                { name: 'Cersei', faction: 'House Stark', agendas: [], deckId: this.cerseiDeck._id }
            ];

            await this.save({ startedAt: '2026-10-02T19:00:00Z', players: players() });
            await this.save({
                startedAt: '2026-10-03T19:00:00Z',
                winner: 'Cersei',
                players: players()
            });
            await this.save({ startedAt: '2026-10-04T19:00:00Z', players: players() });
            await this.save({
                startedAt: '2026-10-05T19:00:00Z',
                finished: false,
                players: players()
            });
            await this.save({
                startedAt: '2026-10-06T19:00:00Z',
                players: [players()[0]]
            });

            const decks = await this.deckService.findByUserName('Ned');
            expect(decks.data[0].record).toEqual({ games: 3, wins: 2 });
            expect((await this.deckService.findByUserName('Cersei')).data[0].record).toEqual({
                games: 3,
                wins: 1
            });
            expect((await this.deckService.getById(this.nedDeck._id)).record).toBeUndefined();

            const stats = await this.statsService.getMonth(this.ned._id, '2026-10', new Date());
            expect(stats.decks).toEqual([
                jasmine.objectContaining({ name: "Ned's deck", games: 3, wins: 2 })
            ]);
        });

        it('should name decks in a cached month as they are now', async function () {
            await this.save({
                startedAt: '2026-10-02T19:00:00Z',
                players: [
                    { name: 'Ned', faction: 'House Stark', agendas: [], deckId: this.nedDeck._id },
                    { name: 'Cersei', faction: 'House Stark', agendas: [] }
                ]
            });
            const now = new Date('2026-11-04T00:00:00Z');
            await this.statsService.getMonth(this.ned._id, '2026-10', now);

            await db.query("UPDATE decks SET name = 'Renamed' WHERE id = $1", [this.nedDeck._id]);
            expect(
                (await this.statsService.getMonth(this.ned._id, '2026-10', now)).decks[0].name
            ).toBe('Renamed');

            await this.deckService.delete(this.nedDeck._id);
            expect(
                (await this.statsService.getMonth(this.ned._id, '2026-10', now)).decks[0].name
            ).toBeNull();
        });

        it('should keep the game but drop the deck when the deck is deleted', async function () {
            await this.save({
                startedAt: '2026-10-02T19:00:00Z',
                players: [
                    { name: 'Ned', faction: 'House Stark', agendas: [], deckId: this.nedDeck._id },
                    { name: 'Cersei', faction: 'House Stark', agendas: [] }
                ]
            });

            await this.deckService.delete(this.nedDeck._id);

            const [row] = await db.query('SELECT deck_id FROM game_players WHERE position = 0');
            expect(row.deck_id).toBeNull();
        });
    });

    describe('Wrapped', function () {
        beforeEach(async function () {
            for (let day = 1; day <= 12; day++) {
                await this.save({
                    startedAt: `2026-03-${String(day).padStart(2, '0')}T19:00:00Z`,
                    winner: day <= 8 ? 'Ned' : 'Cersei'
                });
            }

            this.wrappedService = new WrappedService();
            this.emailService = { sendEmail: jasmine.createSpy('sendEmail').and.resolveTo(true) };
            this.wrappedEmailService = new WrappedEmailService(config, this.emailService);
        });

        it('should only make snapshots for players with enough games', async function () {
            await this.save({
                startedAt: '2026-03-20T19:00:00Z',
                winner: 'Jon',
                players: [
                    { name: 'Ned', faction: 'House Stark', agendas: [], power: 2 },
                    { name: 'Jon', faction: "The Night's Watch", agendas: [], power: 15 }
                ]
            });

            const result = await this.wrappedService.generate({ year: 2026, to: '2026-12-15' });

            expect(result).toEqual(jasmine.objectContaining({ eligible: 2, saved: 2, failed: 0 }));

            const { wrapped } = await this.wrappedService.getForUser(this.ned._id, 2026);
            expect(wrapped.games).toBe(13);
            expect(wrapped.wins).toBe(8);
            expect(wrapped.byMonth[2]).toBe(13);
            expect(wrapped.favouriteFaction.faction).toBe('stark');
            expect(wrapped.ranks).toEqual({ games: 50, wins: 50, winRate: 50, dominantWins: 50 });
            expect(wrapped.site).toEqual({
                games: 13,
                players: 3,
                detailedFrom: null,
                topFaction: 'stark'
            });

            const jon = await this.userService.getUserByUsername('Jon');
            expect(await this.wrappedService.getForUser(jon._id, 2026)).toBeNull();
            expect(await this.wrappedService.getForUser(this.ned._id, '99999999999')).toBeNull();
        });

        it('should expire a Wrapped two months after it was generated', async function () {
            await this.wrappedService.generate({ year: 2026, to: '2026-12-15' });
            await db.query("UPDATE user_wrapped SET generated_at = now() - interval '61 days'");

            expect(await this.wrappedService.getForUser(this.ned._id, 2026)).toEqual({
                expired: true
            });
            expect((await this.wrappedEmailService.send({ year: 2026 })).recipients).toBe(0);
        });

        it('should keep one Wrapped per player, removing earlier years', async function () {
            await this.wrappedService.generate({ year: 2026, to: '2026-12-15' });
            await db.query('UPDATE user_wrapped SET year = 2025');
            await this.wrappedService.generate({ year: 2026, to: '2026-12-15' });

            expect(await db.query('SELECT DISTINCT year FROM user_wrapped')).toEqual([
                { year: 2026 }
            ]);
        });

        it('should not email snapshots of an old version', async function () {
            await this.wrappedService.generate({ year: 2026, to: '2026-12-15' });
            await db.query('UPDATE user_wrapped SET version = version - 1');

            expect((await this.wrappedEmailService.send({ year: 2026 })).recipients).toBe(0);
        });

        it('should email each player once, and not those who unsubscribed', async function () {
            await this.wrappedService.generate({ year: 2026, to: '2026-12-15' });

            const cersei = await this.userService.getUserByUsername('Cersei');
            expect(
                await this.wrappedEmailService.unsubscribe(
                    cersei._id,
                    unsubscribeToken('hmac', cersei._id)
                )
            ).toBe(true);
            expect(await this.wrappedEmailService.unsubscribe(cersei._id, 'wrong')).toBe(false);

            const first = await this.wrappedEmailService.send({ year: 2026, perSecond: 1000 });
            expect(first).toEqual(jasmine.objectContaining({ recipients: 1, sent: 1, failed: 0 }));
            expect(this.emailService.sendEmail).toHaveBeenCalledWith(
                'ned@example.test',
                'Your 2026 page in the White Book is ready',
                jasmine.any(String),
                jasmine.objectContaining({ html: jasmine.any(String) })
            );

            await this.wrappedService.generate({ year: 2026, to: '2026-12-31' });
            const second = await this.wrappedEmailService.send({ year: 2026, perSecond: 1000 });
            expect(second.recipients).toBe(0);
        });
    });

    describe('dominant wins', function () {
        it('should be counted the same way by user stats and Wrapped rankings', async function () {
            const names = ['Cersei', 'Jon', 'Robb'];

            for (const [index, testCase] of DominantWinCases.entries()) {
                await this.save({
                    startedAt: `2026-04-${String(index + 1).padStart(2, '0')}T19:00:00Z`,
                    winner: testCase.won === false ? 'Cersei' : 'Ned',
                    reason: testCase.reason,
                    players: [
                        { name: 'Ned', faction: 'House Stark', agendas: [], power: testCase.power },
                        ...testCase.opponents.map((power, opponent) => ({
                            name: names[opponent],
                            faction: 'House Lannister',
                            agendas: [],
                            power
                        }))
                    ]
                });
            }

            const expected = DominantWinCases.filter((testCase) => testCase.dominant).length;
            const stats = await this.statsService.getMonth(this.ned._id, '2026-04', new Date());
            const [ned] = (
                await new WrappedService().getEligiblePlayers('2026-01-01', '2027-01-01')
            ).filter((player) => player.username === 'Ned');

            expect(stats.dominantWins).toBe(expected);
            expect(ned.dominantWins).toBe(expected);
        });
    });

    describe('the email updates setting', function () {
        it('should default to on, and only change when it is given', async function () {
            let user = await this.userService.getUserByUsername('Ned');
            expect(user.getWireSafeDetails().emailUpdates).toBe(true);

            await this.userService.update({ ...user.getDetails(), emailUpdates: false });
            user = await this.userService.getUserByUsername('Ned');
            expect(user.getWireSafeDetails().emailUpdates).toBe(false);

            const { emailUpdates, ...withoutSetting } = user.getDetails();
            expect(emailUpdates).toBe(false);
            await db.query("UPDATE users SET email_updates = true WHERE username = 'Ned'");
            await this.userService.update({ ...withoutSetting });
            user = await this.userService.getUserByUsername('Ned');
            expect(user.getWireSafeDetails().emailUpdates).toBe(true);
        });
    });
});
