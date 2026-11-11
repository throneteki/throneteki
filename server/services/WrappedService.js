import defaultDb from '../db/index.js';
import logger from '../log.js';
import { DominantWinSql, OpponentPowerJoinSql } from './DominantWin.js';
import UserStatsService, {
    FinishedGameSql,
    InPeriodSql,
    factionCode,
    summarise
} from './UserStatsService.js';

// Bump when the shape of a snapshot changes; the page only shows snapshots of the current version
export const WrappedVersion = 1;

export const MinGames = 10;

// A Wrapped can be seen (and is emailed) for this long after it was generated
export const AvailableForSql = "interval '2 months'";

export const YearPattern = /^20\d{2}$/;

const Concurrency = 4;

// As "top N%" (1 is the very top). Ties share the better rank.
export function topPercent(sortedDescending, value) {
    const higher = sortedDescending.findIndex((other) => other <= value);
    const position = higher === -1 ? sortedDescending.length : higher;

    return Math.max(1, Math.ceil((100 * (position + 1)) / sortedDescending.length));
}

export function rankPlayers(players) {
    const metrics = {
        games: (player) => player.games,
        wins: (player) => player.wins,
        winRate: (player) => player.wins / player.games,
        dominantWins: (player) => player.dominantWins
    };

    const sorted = {};
    for (const [name, metric] of Object.entries(metrics)) {
        sorted[name] = players.map(metric).sort((a, b) => b - a);
    }

    const ranks = new Map();
    for (const player of players) {
        const playerRanks = {};
        for (const [name, metric] of Object.entries(metrics)) {
            playerRanks[name] = topPercent(sorted[name], metric(player));
        }

        ranks.set(player.userId, playerRanks);
    }

    return ranks;
}

export function buildWrapped({ year, from, to, rows, ranks, site }) {
    const summary = summarise(rows);

    const byMonth = new Array(12).fill(0);
    for (const [day, count] of Object.entries(summary.byDay)) {
        byMonth[Number(day.slice(5, 7)) - 1] += count;
    }

    // When games started (UTC) by month and quarter of an hour, so the page can show the time of day in the
    // viewer's timezone using each month's own offset
    const startTimes = Array.from({ length: 12 }, () => new Array(96).fill(0));
    for (const row of rows) {
        startTimes[Number(row.day.slice(5, 7)) - 1][row.quarter_hour]++;
    }

    return {
        ...summary,
        version: WrappedVersion,
        year,
        from,
        to,
        byMonth,
        startTimes,
        favouriteFaction: summary.factions[0] || null,
        topPairing: summary.pairings[0] || null,
        ranks,
        site
    };
}

class WrappedService {
    constructor(db = defaultDb) {
        this.db = db;
        this.userStatsService = new UserStatsService(db);
    }

    async getEligiblePlayers(from, to) {
        const rows = await this.db.query(
            `SELECT gp.user_id, u.username, count(*) AS games, count(*) FILTER (WHERE gp.name = ANY(g.winners)) AS wins,
                count(*) FILTER (WHERE ${DominantWinSql}) AS dominant_wins
            FROM game_players gp
            JOIN games g ON g.id = gp.game_id
            JOIN users u ON u.id = gp.user_id
            ${OpponentPowerJoinSql}
            WHERE ${InPeriodSql(1, 2)} AND ${FinishedGameSql} AND NOT u.disabled
            GROUP BY gp.user_id, u.username
            HAVING count(*) >= $3`,
            [from, to, MinGames]
        );

        return rows.map((row) => ({
            userId: row.user_id,
            username: row.username,
            games: row.games,
            wins: row.wins,
            dominantWins: row.dominant_wins
        }));
    }

    async getSiteTotals(from, to) {
        const [totals] = await this.db.query(
            `SELECT count(DISTINCT g.id) AS games, count(DISTINCT gp.user_id) AS players,
                to_char(min(g.started_at AT TIME ZONE 'UTC') FILTER (WHERE gp.stats IS NOT NULL), 'YYYY-MM-DD') AS detailed_from
            FROM game_players gp JOIN games g ON g.id = gp.game_id
            WHERE ${InPeriodSql(1, 2)} AND ${FinishedGameSql}`,
            [from, to]
        );

        const factions = await this.db.query(
            `SELECT gp.faction, count(*) AS games
            FROM game_players gp JOIN games g ON g.id = gp.game_id
            WHERE ${InPeriodSql(1, 2)} AND ${FinishedGameSql} AND gp.faction IS NOT NULL
            GROUP BY gp.faction ORDER BY games DESC, gp.faction LIMIT 1`,
            [from, to]
        );

        return {
            games: totals?.games || 0,
            players: totals?.players || 0,
            detailedFrom: totals?.detailed_from || null,
            topFaction: factions[0] ? factionCode(factions[0].faction) : null
        };
    }

    // Saving again replaces a snapshot but keeps when it was emailed, so nobody is emailed twice. Players only have
    // one Wrapped, so generating everyone's removes earlier years'.
    async generate({ year, to, username, dryRun = false, progress = () => {} }) {
        const from = `${year}-01-01`;

        const players = await this.getEligiblePlayers(from, to);
        progress(`${players.length} players with ${MinGames}+ games from ${from} to ${to}`);

        const ranks = rankPlayers(players);
        const site = await this.getSiteTotals(from, to);
        progress(
            `Site: ${site.games} games, ${site.players} players, detailed stats from ${site.detailedFrom}`
        );

        const targets = username
            ? players.filter((player) => player.username.toLowerCase() === username.toLowerCase())
            : players;
        if (username && targets.length === 0) {
            throw new Error(`${username} doesn't have ${MinGames}+ games in this period`);
        }

        const result = { eligible: players.length, saved: 0, failed: 0 };
        let next = 0;

        const worker = async () => {
            while (next < targets.length) {
                const player = targets[next++];

                try {
                    const wrapped = buildWrapped({
                        year,
                        from,
                        to,
                        rows: await this.userStatsService.getGameRows(player.userId, from, to),
                        ranks: ranks.get(player.userId),
                        site
                    });

                    if (!dryRun) {
                        await this.save(player.userId, wrapped);
                    }

                    result.saved++;
                    result.sample = result.sample || wrapped;
                } catch (err) {
                    result.failed++;
                    logger.error('Unable to generate Wrapped for %s %s', player.username, err);
                }

                if ((result.saved + result.failed) % 100 === 0) {
                    progress(`${result.saved + result.failed} of ${targets.length}`);
                }
            }
        };

        await Promise.all(Array.from({ length: Concurrency }, worker));

        if (!dryRun && !username) {
            await this.db.query('DELETE FROM user_wrapped WHERE year < $1', [year]);
        }

        return result;
    }

    save(userId, wrapped) {
        return this.db.query(
            `INSERT INTO user_wrapped (user_id, year, version, data, generated_at)
            VALUES ($1, $2, $3, $4, now())
            ON CONFLICT (user_id, year)
            DO UPDATE SET version = EXCLUDED.version, data = EXCLUDED.data, generated_at = EXCLUDED.generated_at`,
            [userId, wrapped.year, wrapped.version, JSON.stringify(wrapped)]
        );
    }

    // Returns { wrapped } or { expired: true }, or null when the player has no Wrapped for the year
    async getForUser(userId, year) {
        if (!YearPattern.test(String(year))) {
            return null;
        }

        const rows = await this.db.query(
            `SELECT data, generated_at > now() - ${AvailableForSql} AS available
            FROM user_wrapped WHERE user_id = $1 AND year = $2 AND version = $3`,
            [userId, Number(year), WrappedVersion]
        );

        if (!rows[0]) {
            return null;
        }

        if (!rows[0].available) {
            return { expired: true };
        }

        return { wrapped: await this.userStatsService.withNames(rows[0].data) };
    }
}

export default WrappedService;
