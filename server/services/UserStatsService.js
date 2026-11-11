import defaultDb from '../db/index.js';
import logger from '../log.js';
import { isDominantWin } from './DominantWin.js';

// Bump when the shape of the summary changes, so cached months are recomputed
export const SummaryVersion = 1;

// A game left open for hours shouldn't count as hours played
const MaxSecondsPerGame = 3 * 60 * 60;

// Games can finish a while after they start, so a month is only cached once it's been over this long
const ClosedMonthDelayMs = 24 * 60 * 60 * 1000;

const MaxListedDecks = 10;
const MaxListedOpponents = 10;
const MaxListedCards = 10;
const MaxListedPairings = 10;

export const WinReasons = ['power', 'concede', 'remaining', 'time'];

const ChallengeTypes = ['military', 'intrigue', 'power'];

const MonthPattern = /^(\d{4})-(0[1-9]|1[0-2])$/;

const DetailedCounters = [
    'cardsDrawn',
    'cardsMarshalled',
    'cardsOutOfShadows',
    'cardsSacrificed',
    'charactersKilled',
    'claimsApplied',
    'dominanceWon',
    'eventsPlayed',
    'goldGained',
    'initiativeWon',
    'powerFromRenown',
    'powerGained',
    'rounds',
    'unopposedChallengesWon'
];

// Only games that finished with a winner and had at least one opponent count
export const FinishedGameSql = `g.finished_at IS NOT NULL AND cardinality(g.winners) > 0
    AND EXISTS (SELECT 1 FROM game_players o WHERE o.game_id = gp.game_id AND o.position <> gp.position)`;

// Periods are UTC dates (YYYY-MM-DD), so they don't depend on the database's timezone
export const InPeriodSql = (from, to) =>
    `g.started_at >= ($${from}::timestamp AT TIME ZONE 'UTC') AND g.started_at < ($${to}::timestamp AT TIME ZONE 'UTC')`;

// "House Stark" -> "stark", "The Night's Watch" -> "thenightswatch", matching the client's faction values
export function factionCode(faction) {
    if (!faction) {
        return 'unknown';
    }

    return faction
        .toLowerCase()
        .replace(/^house /, '')
        .replace(/[^a-z]/g, '');
}

function increment(counts, key, amount = 1) {
    counts[key] = (counts[key] || 0) + amount;
}

function byChallengeType() {
    return Object.fromEntries(ChallengeTypes.map((type) => [type, 0]));
}

function best(items, score) {
    let result = null;
    for (const item of items) {
        if (score(item) > 0 && (!result || score(item) > score(result))) {
            result = item;
        }
    }

    return result;
}

function tally(map, key, create, won, dominant) {
    let entry = map.get(key);
    if (!entry) {
        entry = { ...create(), games: 0, wins: 0, dominantWins: 0 };
        map.set(key, entry);
    }

    entry.games++;
    entry.wins += won ? 1 : 0;
    entry.dominantWins += dominant ? 1 : 0;

    return entry;
}

const byGames = (a, b) => b.games - a.games || b.wins - a.wins;

// Rows must be ordered by start time. Opponents and decks are kept by id and only named by nameSummary when the
// stats are read, so a cached summary never shows a name that has since changed or been removed.
export function summarise(rows) {
    const summary = {
        version: SummaryVersion,
        games: 0,
        wins: 0,
        losses: 0,
        meleeGames: 0,
        winReasons: Object.fromEntries(WinReasons.map((reason) => [reason, 0])),
        lossReasons: Object.fromEntries(WinReasons.map((reason) => [reason, 0])),
        powerWins: 0,
        dominantWins: 0,
        seconds: 0,
        fastestWin: null,
        longestWinStreak: 0,
        gameTypes: {},
        byDay: {},
        byWeekday: [0, 0, 0, 0, 0, 0, 0],
        byHour: new Array(24).fill(0),
        factions: [],
        pairings: [],
        pairingCount: 0,
        decks: [],
        deckCount: 0,
        opponents: [],
        detailed: null
    };

    const factions = new Map();
    const pairings = new Map();
    const decks = new Map();
    const opponents = new Map();
    const detailed = {
        games: 0,
        challengesInitiated: byChallengeType(),
        challengesWon: byChallengeType(),
        challengesLost: byChallengeType(),
        cards: {}
    };
    for (const counter of DetailedCounters) {
        detailed[counter] = 0;
    }

    let streak = 0;

    for (const row of rows) {
        const won = !!row.won;
        const dominant = isDominantWin(row);
        const reason = WinReasons.includes(row.win_reason) ? row.win_reason : 'other';
        const rounds = row.stats?.rounds || null;

        summary.games++;
        summary.seconds += Math.min(Math.max(row.seconds || 0, 0), MaxSecondsPerGame);
        increment(summary.gameTypes, row.game_type || 'unknown');
        increment(summary.byDay, row.day);
        summary.byWeekday[row.weekday - 1]++;
        summary.byHour[row.hour]++;

        if (row.opponents.length > 1) {
            summary.meleeGames++;
        }

        if (won) {
            summary.wins++;
            increment(summary.winReasons, reason);
            summary.dominantWins += dominant ? 1 : 0;
            streak++;
            summary.longestWinStreak = Math.max(summary.longestWinStreak, streak);

            if (reason === 'power') {
                summary.powerWins++;

                if (rounds && (!summary.fastestWin || rounds < summary.fastestWin.rounds)) {
                    summary.fastestWin = {
                        rounds,
                        day: row.day,
                        faction: factionCode(row.faction),
                        opponentId: row.opponents.length === 1 ? row.opponents[0].userId : null
                    };
                }
            }
        } else {
            summary.losses++;
            increment(summary.lossReasons, reason);
            streak = 0;
        }

        const faction = factionCode(row.faction);
        const agendas = row.agendas || [];
        tally(factions, faction, () => ({ faction }), won, dominant);
        tally(
            pairings,
            [faction, ...agendas].join('|'),
            () => ({ faction, agendas }),
            won,
            dominant
        );

        if (row.deck_id) {
            tally(decks, row.deck_id, () => ({ deckId: row.deck_id, faction }), won, dominant);
        }

        for (const opponent of row.opponents) {
            if (!opponent.userId) {
                continue;
            }

            const entry = tally(
                opponents,
                opponent.userId,
                () => ({ id: opponent.userId, lossesTo: 0 }),
                won,
                dominant
            );
            entry.lossesTo += opponent.won ? 1 : 0;
        }

        // Games played partly in manual mode don't reflect what the cards did
        if (row.stats && !(row.stats.manualActions?.length > 0)) {
            addDetailedStats(detailed, row.stats);
        }
    }

    summary.factions = [...factions.values()].sort(byGames);

    const pairingList = [...pairings.values()].sort(byGames);
    summary.pairings = pairingList.slice(0, MaxListedPairings);
    summary.pairingCount = pairingList.length;

    const deckList = [...decks.values()].sort(byGames);
    summary.decks = deckList.slice(0, MaxListedDecks);
    summary.deckCount = deckList.length;

    // Every opponent is kept, as some may be left out when they're named
    summary.opponents = [...opponents.values()];

    if (detailed.games > 0) {
        const cards = Object.entries(detailed.cards).map(([code, card]) => ({ code, ...card }));
        detailed.cards = cards
            .filter((card) => card.marshalled + card.played > 0)
            .sort(
                (a, b) =>
                    b.marshalled + b.played - (a.marshalled + a.played) ||
                    a.code.localeCompare(b.code)
            )
            .slice(0, MaxListedCards);
        detailed.mvp = best(cards, (card) => card.attacked + card.defended);
        detailed.favouritePlot = best(cards, (card) => card.revealed);
        detailed.cardCount = cards.length;
        summary.detailed = detailed;
    }

    return summary;
}

function addDetailedStats(detailed, stats) {
    detailed.games++;

    for (const counter of DetailedCounters) {
        detailed[counter] += stats[counter] || 0;
    }

    for (const key of ['challengesInitiated', 'challengesWon', 'challengesLost']) {
        for (const type of ChallengeTypes) {
            detailed[key][type] += stats[key]?.[type] || 0;
        }
    }

    for (const [code, card] of Object.entries(stats.cards || {})) {
        if (!detailed.cards[code]) {
            detailed.cards[code] = {
                attacked: 0,
                defended: 0,
                killed: 0,
                marshalled: 0,
                played: 0,
                revealed: 0
            };
        }

        for (const key of Object.keys(detailed.cards[code])) {
            detailed.cards[code][key] += card[key] || 0;
        }
    }
}

// Names the opponents and decks in a summary from summarise(), leaving out disabled (deleted or banned) accounts, and
// picks the rival (most games) and nemesis (won the most games against the player). Deleted decks have no name.
export function nameSummary(summary, users, deckNames = new Map()) {
    const active = (id) => users.has(id) && !users.get(id).disabled;

    const opponents = summary.opponents
        .filter((opponent) => active(opponent.id))
        .map((opponent) => ({
            name: users.get(opponent.id).name,
            games: opponent.games,
            wins: opponent.wins,
            lossesTo: opponent.lossesTo
        }))
        .sort((a, b) => b.games - a.games || a.name.localeCompare(b.name));

    const { opponentId, ...fastestWin } = summary.fastestWin || {};

    return {
        ...summary,
        decks: summary.decks.map((deck) => ({ ...deck, name: deckNames.get(deck.deckId) ?? null })),
        opponents: opponents.slice(0, MaxListedOpponents),
        opponentCount: opponents.length,
        rival: opponents[0] || null,
        nemesis: best(opponents, (opponent) => opponent.lossesTo),
        fastestWin: summary.fastestWin
            ? { ...fastestWin, opponent: active(opponentId) ? users.get(opponentId).name : null }
            : null
    };
}

export function monthRange(month) {
    const match = MonthPattern.exec(month || '');
    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const monthNumber = Number(match[2]);
    const next =
        monthNumber === 12
            ? `${year + 1}-01`
            : `${year}-${String(monthNumber + 1).padStart(2, '0')}`;

    return { from: `${month}-01`, to: `${next}-01` };
}

class UserStatsService {
    constructor(db = defaultDb) {
        this.db = db;
    }

    // Games started in [from, to), oldest first
    getGameRows(userId, from, to) {
        return this.db.query(
            `SELECT to_char(g.started_at AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS day,
                EXTRACT(ISODOW FROM g.started_at AT TIME ZONE 'UTC')::int AS weekday,
                EXTRACT(HOUR FROM g.started_at AT TIME ZONE 'UTC')::int AS hour,
                (EXTRACT(HOUR FROM g.started_at AT TIME ZONE 'UTC') * 4
                    + FLOOR(EXTRACT(MINUTE FROM g.started_at AT TIME ZONE 'UTC') / 15))::int AS quarter_hour,
                EXTRACT(EPOCH FROM g.finished_at - g.started_at)::int AS seconds,
                g.game_type, g.win_reason, gp.name = ANY(g.winners) AS won,
                gp.faction, gp.agendas, gp.power, gp.stats, gp.deck_id,
                (SELECT json_agg(json_build_object('userId', o.user_id, 'power', o.power, 'won', o.name = ANY(g.winners))
                    ORDER BY o.position)
                    FROM game_players o WHERE o.game_id = gp.game_id AND o.position <> gp.position) AS opponents
            FROM game_players gp
            JOIN games g ON g.id = gp.game_id
            WHERE gp.user_id = $1 AND ${InPeriodSql(2, 3)} AND ${FinishedGameSql}
            ORDER BY g.started_at, g.id`,
            [userId, from, to]
        );
    }

    async withNames(summary) {
        const ids = [
            ...new Set(
                summary.opponents
                    .map((opponent) => opponent.id)
                    .concat(summary.fastestWin?.opponentId || [])
            )
        ];
        const deckIds = summary.decks.map((deck) => deck.deckId);
        const [users, decks] = await Promise.all([
            ids.length
                ? this.db.query('SELECT id, username, disabled FROM users WHERE id = ANY($1)', [
                      ids
                  ])
                : [],
            deckIds.length
                ? this.db.query('SELECT id, name FROM decks WHERE id = ANY($1)', [deckIds])
                : []
        ]);

        return nameSummary(
            summary,
            new Map(users.map((row) => [row.id, { name: row.username, disabled: row.disabled }])),
            new Map(decks.map((row) => [row.id, row.name]))
        );
    }

    // YYYY-MM, newest first
    async getMonths(userId) {
        const rows = await this.db.query(
            `SELECT DISTINCT to_char(g.started_at AT TIME ZONE 'UTC', 'YYYY-MM') AS month
            FROM game_players gp JOIN games g ON g.id = gp.game_id
            WHERE gp.user_id = $1 AND ${FinishedGameSql}
            ORDER BY month DESC`,
            [userId]
        );

        return rows.map((row) => row.month);
    }

    // Months that have ended are cached, as they can't change
    async getMonth(userId, month, now = new Date()) {
        const range = monthRange(month);
        if (!range) {
            return null;
        }

        const isClosed = now.getTime() - Date.parse(`${range.to}T00:00:00Z`) > ClosedMonthDelayMs;

        if (isClosed) {
            const cached = await this.db.query(
                'SELECT data FROM user_monthly_stats WHERE user_id = $1 AND month = $2 AND version = $3',
                [userId, range.from, SummaryVersion]
            );

            if (cached.length > 0) {
                return this.withNames(cached[0].data);
            }
        }

        const summary = summarise(await this.getGameRows(userId, range.from, range.to));

        if (isClosed && summary.games > 0) {
            try {
                await this.db.query(
                    `INSERT INTO user_monthly_stats (user_id, month, version, data, computed_at)
                    VALUES ($1, $2, $3, $4, now())
                    ON CONFLICT (user_id, month)
                    DO UPDATE SET version = EXCLUDED.version, data = EXCLUDED.data, computed_at = EXCLUDED.computed_at`,
                    [userId, range.from, SummaryVersion, JSON.stringify(summary)]
                );
            } catch (err) {
                // The stats are still right, they'll just be worked out again next time
                logger.error('Unable to cache stats for user %s month %s %s', userId, month, err);
            }
        }

        return this.withNames(summary);
    }
}

export default UserStatsService;
