import defaultDb from '../db/index.js';
import { escapeLike, getOrder, getPaging, getRequestedFilters } from './listQuery.js';

const FilterableFields = ['id', 'reporter', 'players', 'gameName'];
const SortColumns = { createdAt: 'created_at' };
const MaxPageSize = 50;

const stringOrNull = (value) => (typeof value === 'string' ? value : null);

export function getReportSummary(report) {
    const game = report.game && typeof report.game === 'object' ? report.game : {};

    return {
        reporter: stringOrNull(report.reporter),
        source: stringOrNull(report.source),
        gameName: stringOrNull(game.name),
        round: Number.isInteger(game.round) ? game.round : null,
        phase: stringOrNull(game.phase),
        players: Array.isArray(report.players)
            ? report.players
                  .map((player) => player?.name)
                  .filter((name) => typeof name === 'string')
            : []
    };
}

function getConditions(options, params) {
    const conditions = ['expires_at > now()'];

    for (const { id, values } of getRequestedFilters(options, FilterableFields)) {
        params.push(values.map((val) => `%${escapeLike(val)}%`));
        const patterns = `$${params.length}::text[]`;

        if (id === 'id') {
            conditions.push(`id::text ILIKE ANY (${patterns})`);
        } else if (id === 'reporter') {
            conditions.push(`reporter ILIKE ANY (${patterns})`);
        } else if (id === 'gameName') {
            conditions.push(`game_name ILIKE ANY (${patterns})`);
        } else {
            conditions.push(
                `EXISTS (SELECT 1 FROM unnest(players) AS player WHERE player ILIKE ANY (${patterns}))`
            );
        }
    }

    return conditions;
}

class ProblemReportService {
    constructor(db = defaultDb) {
        this.db = db;
    }

    async create(report) {
        const summary = getReportSummary(report);

        await this.db.query(
            `INSERT INTO problem_reports (id, report, reporter, source, game_name, round, phase, players)
             VALUES ($1, $2::jsonb, $3, $4, $5, $6, $7, $8)`,
            [
                report.id,
                JSON.stringify(report),
                summary.reporter,
                summary.source,
                summary.gameName,
                summary.round,
                summary.phase,
                summary.players
            ]
        );

        return { id: report.id, createdAt: report.createdAt };
    }

    async getById(id) {
        const rows = await this.db.query(
            `SELECT report FROM problem_reports WHERE id = $1 AND expires_at > now()`,
            [id]
        );

        return rows[0]?.report;
    }

    async list(options = {}) {
        const params = [];
        const where = getConditions(options, params).join(' AND ');
        const order = getOrder(options, SortColumns, 'created_at DESC');
        const { page, pageSize, offset } = getPaging(options, MaxPageSize);

        const [{ count }] = await this.db.query(
            `SELECT count(*) AS count FROM problem_reports WHERE ${where}`,
            params
        );

        if (count === 0) {
            return { success: true, data: [], totalCount: 0, page, pageSize };
        }

        const rows = await this.db.query(
            `SELECT id, created_at, reporter, source, game_name, round, phase, players
             FROM problem_reports
             WHERE ${where}
             ORDER BY ${order}, id
             LIMIT ${pageSize} OFFSET ${offset}`,
            params
        );

        return {
            success: true,
            totalCount: count,
            page,
            pageSize,
            data: rows.map((row) => ({
                id: row.id,
                createdAt: row.created_at,
                reporter: row.reporter,
                source: row.source,
                gameName: row.game_name,
                round: row.round,
                phase: row.phase,
                players: row.players
            }))
        };
    }

    async deleteExpired() {
        return this.db.query('DELETE FROM problem_reports WHERE expires_at <= now()');
    }
}

export default ProblemReportService;
