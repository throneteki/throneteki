import defaultDb from '../db/index.js';
import logger from '../log.js';

const MaxPower = 2147483647;

function toDate(value) {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
}

export function toWinners(winner) {
    if (!winner) {
        return [];
    }

    return Array.isArray(winner) ? winner : [winner];
}

function fromWinners(winners) {
    if (winners.length === 0) {
        return undefined;
    }

    return winners.length === 1 ? winners[0] : winners;
}

export function playerRows(players) {
    return (players || []).map((player, position) => {
        const { name, faction, agendas, power, eliminated, stats, ...details } = player;

        return {
            position,
            name,
            faction: faction ?? null,
            agendas: agendas || [],
            power: Number.isInteger(power) && Math.abs(power) <= MaxPower ? power : null,
            eliminated: !!eliminated,
            details,
            stats: stats ?? null
        };
    });
}

class GameService {
    constructor(db = defaultDb) {
        this.db = db;
    }

    async savePlayers(tx, gameId, players) {
        await tx.query('DELETE FROM game_players WHERE game_id = $1', [gameId]);
        await tx.query(
            `INSERT INTO game_players (game_id, position, name, user_id, faction, agendas, power, eliminated, details, stats)
            SELECT $1, p.position, p.name, (SELECT id FROM users WHERE lower(username) = lower(p.name)),
                p.faction, p.agendas, p.power, p.eliminated, p.details, p.stats
            FROM jsonb_to_recordset($2::jsonb)
                AS p(position integer, name text, faction text, agendas text[], power integer, eliminated boolean, details jsonb, stats jsonb)`,
            [gameId, JSON.stringify(playerRows(players))]
        );
    }

    create(game) {
        return this.db
            .transaction(async (tx) => {
                const [{ id }] = await tx.query(
                    `INSERT INTO games (game_id, event_name, started_at, finished_at, winners, win_reason, game_type)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                    [
                        game.gameId,
                        game.eventName ?? null,
                        toDate(game.startedAt),
                        toDate(game.finishedAt),
                        toWinners(game.winner),
                        game.winReason ?? null,
                        game.gameType ?? null
                    ]
                );

                await this.savePlayers(tx, id, game.players);

                return { ...game, _id: String(id) };
            })
            .catch((err) => {
                logger.error('Unable to create game %s', err);
                throw new Error('Unable to create game');
            });
    }

    update(game) {
        return this.db
            .transaction(async (tx) => {
                const rows = await tx.query(
                    `UPDATE games SET event_name = $1, started_at = $2, finished_at = $3, winners = $4, win_reason = $5,
                        game_type = COALESCE($7, game_type)
                    WHERE game_id = $6 RETURNING id`,
                    [
                        game.eventName ?? null,
                        toDate(game.startedAt),
                        toDate(game.finishedAt),
                        toWinners(game.winner),
                        game.winReason ?? null,
                        game.gameId,
                        game.gameType ?? null
                    ]
                );

                if (rows[0]) {
                    await this.savePlayers(tx, rows[0].id, game.players);
                }
            })
            .catch((err) => {
                logger.error('Unable to update game %s', err);
                throw new Error('Unable to update game');
            });
    }

    async getAllGames(from, to) {
        try {
            const rows = await this.db.query(
                `SELECT g.id, g.game_id, g.event_name, g.started_at, g.finished_at, g.winners, g.win_reason, g.game_type, g.legacy,
                    COALESCE((
                        SELECT json_agg(json_build_object(
                            'name', p.name, 'faction', p.faction, 'agendas', p.agendas, 'power', p.power,
                            'eliminated', p.eliminated, 'details', p.details, 'stats', p.stats
                        ) ORDER BY p.position)
                        FROM game_players p WHERE p.game_id = g.id
                    ), '[]') AS players
                FROM games g
                WHERE ($1::timestamptz IS NULL OR g.started_at >= $1) AND ($2::timestamptz IS NULL OR g.started_at < $2)
                ORDER BY g.started_at, g.id`,
                [toDate(from), toDate(to)]
            );

            return rows.map((row) => ({
                ...(row.legacy || {}),
                _id: String(row.id),
                gameId: row.game_id ?? undefined,
                ...(row.game_type ? { gameType: row.game_type } : {}),
                eventName: row.event_name ?? undefined,
                startedAt: row.started_at,
                finishedAt: row.finished_at,
                winner: fromWinners(row.winners),
                winReason: row.win_reason ?? undefined,
                players: row.players.map(({ details, stats, ...player }) => ({
                    ...details,
                    ...player,
                    ...(stats ? { stats } : {})
                }))
            }));
        } catch (err) {
            logger.error('Unable to get all games from %s to %s %s', from, to, err);
            throw new Error('Unable to get all games');
        }
    }
}

export default GameService;
