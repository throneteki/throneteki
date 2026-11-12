import ProblemReportService, {
    getReportSummary
} from '../../../server/services/ProblemReportService.js';

describe('ProblemReportService', function () {
    beforeEach(function () {
        this.db = { query: vi.fn() };
        this.service = new ProblemReportService(this.db);
        this.report = { id: 'f5367ed1-0fe2-4917-8f27-e33d687991d0', game: { phase: 'challenge' } };
    });

    it('stores a report as JSONB using its stable ID, with its summary', async function () {
        await this.service.create(this.report);

        const [sql, params] = this.db.query.mock.calls[0];
        expect(sql).toContain('INSERT INTO problem_reports');
        expect(sql).toContain('$2::jsonb');
        expect(params).toEqual([
            this.report.id,
            JSON.stringify(this.report),
            null,
            null,
            null,
            null,
            'challenge',
            []
        ]);
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

    describe('getReportSummary', function () {
        it('takes the summary fields from the report', function () {
            expect(
                getReportSummary({
                    reporter: 'alice',
                    source: 'cancel-prompt',
                    game: { name: 'Test game', round: 3, phase: 'challenge' },
                    players: [{ name: 'alice' }, { name: 'bob' }]
                })
            ).toEqual({
                reporter: 'alice',
                source: 'cancel-prompt',
                gameName: 'Test game',
                round: 3,
                phase: 'challenge',
                players: ['alice', 'bob']
            });
        });

        it('keeps round 0', function () {
            expect(getReportSummary({ game: { round: 0 } }).round).toBe(0);
        });

        it('ignores malformed values', function () {
            expect(
                getReportSummary({
                    reporter: 5,
                    game: 'challenge',
                    players: { name: 'alice' }
                })
            ).toEqual({
                reporter: null,
                source: null,
                gameName: null,
                round: null,
                phase: null,
                players: []
            });
            expect(getReportSummary({ game: { round: 'two' } }).round).toBeNull();
            expect(
                getReportSummary({ players: [null, { name: 'bob' }, { name: 3 }] }).players
            ).toEqual(['bob']);
        });
    });
});
