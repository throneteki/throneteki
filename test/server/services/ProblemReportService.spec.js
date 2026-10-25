import ProblemReportService from '../../../server/services/ProblemReportService.js';

describe('ProblemReportService', function () {
    beforeEach(function () {
        this.db = { query: vi.fn() };
        this.service = new ProblemReportService(this.db);
        this.report = { id: 'f5367ed1-0fe2-4917-8f27-e33d687991d0', game: { phase: 'challenge' } };
    });

    it('stores a report as JSONB using its stable ID', async function () {
        await this.service.create(this.report);

        expect(this.db.query).toHaveBeenCalledWith(
            'INSERT INTO problem_reports (id, report) VALUES ($1, $2::jsonb)',
            [this.report.id, JSON.stringify(this.report)]
        );
    });

    it('loads an unexpired report by ID', async function () {
        this.db.query.mockResolvedValue([{ report: this.report }]);

        await expect(this.service.getById(this.report.id)).resolves.toEqual(this.report);
        expect(this.db.query).toHaveBeenCalledWith(
            'SELECT report FROM problem_reports WHERE id = $1 AND expires_at > now()',
            [this.report.id]
        );
    });

    it('returns undefined for a missing or expired report', async function () {
        this.db.query.mockResolvedValue([]);

        await expect(this.service.getById(this.report.id)).resolves.toBeUndefined();
    });

    it('deletes expired reports', async function () {
        await this.service.deleteExpired();

        expect(this.db.query).toHaveBeenCalledWith(
            'DELETE FROM problem_reports WHERE expires_at <= now()'
        );
    });
});
