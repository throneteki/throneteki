import defaultDb from '../db/index.js';

class ProblemReportService {
    constructor(db = defaultDb) {
        this.db = db;
    }

    async create(report) {
        await this.db.query(`INSERT INTO problem_reports (id, report) VALUES ($1, $2::jsonb)`, [
            report.id,
            JSON.stringify(report)
        ]);

        return { id: report.id, createdAt: report.createdAt };
    }

    async getById(id) {
        const rows = await this.db.query(
            `SELECT report FROM problem_reports WHERE id = $1 AND expires_at > now()`,
            [id]
        );

        return rows[0]?.report;
    }

    async deleteExpired() {
        return this.db.query('DELETE FROM problem_reports WHERE expires_at <= now()');
    }
}

export default ProblemReportService;
