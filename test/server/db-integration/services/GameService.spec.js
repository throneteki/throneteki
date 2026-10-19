import { resetDatabase } from '../helpers/database.js';
import GameService from '../../../../server/services/GameService.js';
import UserService from '../../../../server/services/UserService.js';
import db from '../helpers/database.js';

function saveState(overrides = {}) {
    return {
        id: undefined,
        gameId: 'game-1',
        startedAt: new Date('2026-03-01T12:00:00Z'),
        players: [
            {
                name: 'Stark',
                faction: 'stark',
                agendas: ['Fealty'],
                power: 4,
                standing: 2,
                eliminated: false
            },
            {
                name: 'Lannister',
                faction: 'lannister',
                agendas: [],
                power: 1,
                eliminated: true,
                eliminatedReason: 'decked'
            }
        ],
        ...overrides
    };
}

describe('Postgres GameService', function () {
    beforeEach(async function () {
        await resetDatabase();

        this.service = new GameService();
        await new UserService({ getValue: () => 'test-secret' }).addUser({
            username: 'Stark',
            email: 'ned@winterfell.example',
            password: 'hash'
        });
    });

    it('should save a game and its result and return it as MongoDB did', async function () {
        await this.service.create(saveState());
        await this.service.update(
            saveState({
                eventName: 'Tournament',
                winner: 'Stark',
                winReason: 'power',
                finishedAt: new Date('2026-03-01T13:00:00Z')
            })
        );

        const [game] = await this.service.getAllGames();

        expect(game).toEqual({
            _id: jasmine.any(String),
            gameId: 'game-1',
            eventName: 'Tournament',
            startedAt: new Date('2026-03-01T12:00:00Z'),
            finishedAt: new Date('2026-03-01T13:00:00Z'),
            winner: 'Stark',
            winReason: 'power',
            players: [
                {
                    name: 'Stark',
                    faction: 'stark',
                    agendas: ['Fealty'],
                    power: 4,
                    standing: 2,
                    eliminated: false
                },
                {
                    name: 'Lannister',
                    faction: 'lannister',
                    agendas: [],
                    power: 1,
                    eliminated: true,
                    eliminatedReason: 'decked'
                }
            ]
        });
    });

    it('should link players to their accounts when they have one', async function () {
        await this.service.create(saveState());

        const players = await db.query(
            'SELECT name, user_id IS NOT NULL AS linked FROM game_players ORDER BY position'
        );

        expect(players).toEqual([
            { name: 'Stark', linked: true },
            { name: 'Lannister', linked: false }
        ]);
    });

    it('should keep every winner when there is more than one', async function () {
        await this.service.create(saveState({ winner: ['Stark', 'Lannister'] }));

        const [game] = await this.service.getAllGames();

        expect(game.winner).toEqual(['Stark', 'Lannister']);
    });

    it('should not fail on a game that has not finished', async function () {
        await this.service.update(saveState({ finishedAt: undefined }));
        await this.service.create(saveState({ finishedAt: undefined }));

        const [game] = await this.service.getAllGames();

        expect(game.finishedAt).toBeNull();
        expect(game.winner).toBeUndefined();
    });

    it('should store player stats in their own column and return them', async function () {
        const stats = { cardsMarshalled: 3, challengesWon: { military: 1 }, cards: {} };
        const state = saveState();
        state.players[0].stats = stats;

        await this.service.create(state);

        const rows = await db.query('SELECT stats, details FROM game_players ORDER BY position');
        const [game] = await this.service.getAllGames();

        expect(rows).toEqual([
            { stats, details: { standing: 2 } },
            { stats: null, details: { eliminatedReason: 'decked' } }
        ]);
        expect(game.players[0].stats).toEqual(stats);
        expect(game.players[1].stats).toBeUndefined();
    });

    it('should only return games started in the given range', async function () {
        await this.service.create(saveState({ gameId: 'a', startedAt: new Date('2026-01-15') }));
        await this.service.create(saveState({ gameId: 'b', startedAt: new Date('2026-02-15') }));
        await this.service.create(saveState({ gameId: 'c', startedAt: new Date('2026-03-15') }));

        const games = await this.service.getAllGames('2026-02-01', '2026-03-01');

        expect(games.map((game) => game.gameId)).toEqual(['b']);
    });
});
