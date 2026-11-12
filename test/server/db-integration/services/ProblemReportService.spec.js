import db, { resetDatabase } from '../helpers/database.js';
import ProblemReportService from '../../../../server/services/ProblemReportService.js';

const reportId = (number) => `00000000-0000-4000-8000-${String(number).padStart(12, '0')}`;

describe('Postgres ProblemReportService', function () {
    beforeEach(async function () {
        await resetDatabase();
        this.service = new ProblemReportService();
        this.addReport = async (number, createdAt, overrides = {}) => {
            await this.service.create({
                id: reportId(number),
                reporter: 'alice',
                source: 'report',
                game: { name: 'Test game', round: 2, phase: 'challenge' },
                players: [{ name: 'alice' }, { name: 'bob' }],
                ...overrides
            });
            await db.query('UPDATE problem_reports SET created_at = $2 WHERE id = $1', [
                reportId(number),
                createdAt
            ]);
        };
    });

    it('lists unexpired reports newest first with their summary', async function () {
        await this.addReport(1, '2026-11-01T10:00:00Z');
        await this.addReport(2, '2026-11-02T10:00:00Z', {
            reporter: 'bob',
            source: 'cancel-prompt',
            game: { name: 'Other game', round: 0, phase: 'setup' },
            players: [{ name: 'bob' }]
        });
        await this.addReport(3, '2026-11-03T10:00:00Z');
        await db.query(
            "UPDATE problem_reports SET expires_at = now() - interval '1 minute' WHERE id = $1",
            [reportId(3)]
        );

        const result = await this.service.list();

        expect(result).toEqual({
            success: true,
            totalCount: 2,
            page: 1,
            pageSize: 10,
            data: [
                {
                    id: reportId(2),
                    createdAt: new Date('2026-11-02T10:00:00Z'),
                    reporter: 'bob',
                    source: 'cancel-prompt',
                    gameName: 'Other game',
                    round: 0,
                    phase: 'setup',
                    players: ['bob']
                },
                {
                    id: reportId(1),
                    createdAt: new Date('2026-11-01T10:00:00Z'),
                    reporter: 'alice',
                    source: 'report',
                    gameName: 'Test game',
                    round: 2,
                    phase: 'challenge',
                    players: ['alice', 'bob']
                }
            ]
        });
    });

    it('pages the list', async function () {
        for (let number = 1; number <= 5; number++) {
            await this.addReport(number, `2026-11-0${number}T10:00:00Z`);
        }

        const result = await this.service.list({ pageSize: '2', pageNumber: '2' });

        expect(result.totalCount).toBe(5);
        expect(result.page).toBe(2);
        expect(result.data.map((report) => report.id)).toEqual([reportId(3), reportId(2)]);
    });

    it('sorts oldest first when asked', async function () {
        await this.addReport(1, '2026-11-01T10:00:00Z');
        await this.addReport(2, '2026-11-02T10:00:00Z');

        const result = await this.service.list({
            sorting: [{ id: 'createdAt', desc: 'false' }]
        });

        expect(result.data.map((report) => report.id)).toEqual([reportId(1), reportId(2)]);
    });

    it('filters by reporter, player, game and ID', async function () {
        await this.addReport(1, '2026-11-01T10:00:00Z');
        await this.addReport(2, '2026-11-02T10:00:00Z', {
            reporter: 'carol',
            game: { name: 'Carol game', round: 1, phase: 'plot' },
            players: [{ name: 'carol' }, { name: 'dave' }]
        });

        const ids = async (filters) =>
            (await this.service.list({ filters })).data.map((report) => report.id);

        expect(await ids([{ id: 'reporter', value: 'CAR' }])).toEqual([reportId(2)]);
        expect(await ids([{ id: 'players', value: 'dav' }])).toEqual([reportId(2)]);
        expect(await ids([{ id: 'gameName', value: 'test' }])).toEqual([reportId(1)]);
        expect(await ids([{ id: 'id', value: '000000000001' }])).toEqual([reportId(1)]);
        expect(await ids([{ id: 'reporter', value: '%' }])).toEqual([]);
    });

    it('lists a report with malformed players', async function () {
        await this.addReport(1, '2026-11-01T10:00:00Z', { players: { name: 'alice' } });

        const { data } = await this.service.list();

        expect(data[0].players).toEqual([]);
    });
});
