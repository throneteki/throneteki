import fs from 'fs';
import os from 'os';
import path from 'path';
import { runScenario } from '../../../server/devtools/scenario/runner.js';

const specPath = path.join(import.meta.dirname, '../cards/01-Core/Confiscation.spec.js');
const breakPath = path.join(import.meta.dirname, 'fixtures/scenarioBreak.js');
const users = [{ username: 'alice' }, { username: 'bob' }];
const silentLogger = { warn: () => true };

describe('scenario runner', function () {
    it('builds the game from a test for real users', async function () {
        const { game, name, stoppedAtBreak, error } = await runScenario(
            `${specPath}#discards the chosen attachment you control`,
            { users, logger: silentLogger }
        );

        expect(name).toBe(
            'Confiscation when there are attachments in play discards the chosen attachment you control'
        );
        expect(error).toBeUndefined();
        expect(stoppedAtBreak).toBe(false);
        expect(game.getPlayers().map((player) => player.name)).toEqual(['alice', 'bob']);
        expect(game.getPlayerByName('alice').user.username).toBe('alice');

        const littleBird = game.allCards.find((card) => card.name === 'Little Bird');
        expect(littleBird.location).toBe('discard pile');
        expect(game.currentPhase).toBe('marshal');
    });

    it('leaves the game where the test left it', async function () {
        const { game } = await runScenario(`${breakPath}#leaves a prompt open`, {
            users,
            logger: silentLogger
        });

        expect(game.getPlayerByName('alice').currentPrompt().menuTitle).toBe(
            'Select target for attachment'
        );
    });

    it('stops at scenarioBreak', async function () {
        const { game, stoppedAtBreak } = await runScenario(`${breakPath}#stops part way`, {
            users,
            logger: silentLogger
        });
        const card = (name) => game.allCards.find((card) => card.name === name);

        expect(stoppedAtBreak).toBe(true);
        expect(card('Tumblestone Knight').kneeled).toBe(true);
        expect(card('Bastard in Hiding').kneeled).toBe(false);
    });

    it('loads a saved problem report into a new scenario game', async function () {
        const { game: source } = await runScenario(`${breakPath}#stops part way`, {
            users,
            logger: silentLogger
        });
        const report = source.getProblemReport('alice');
        const problemReportService = { getById: vi.fn().mockResolvedValue(report) };
        const { game, name, error } = await runScenario(`report:${report.id}`, {
            users,
            logger: silentLogger,
            problemReportService
        });

        expect(error).toBeUndefined();
        expect(problemReportService.getById).toHaveBeenCalledWith(report.id);
        expect(name).toContain('Problem report');
        expect(game.currentPhase).toBe('marshal');
        expect(game.allCards.find((card) => card.name === 'Tumblestone Knight').kneeled).toBe(true);
    });

    it('loads a downloaded problem report from a file', async function () {
        const { game: source } = await runScenario(`${breakPath}#stops part way`, {
            users,
            logger: silentLogger
        });
        const report = source.getProblemReport('alice');
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'problem-report-'));
        const file = path.join(dir, `${report.id}.json`);
        fs.writeFileSync(file, JSON.stringify(report));

        try {
            const { game, name, error } = await runScenario(`file:${file}`, {
                users,
                logger: silentLogger
            });

            expect(error).toBeUndefined();
            expect(name).toContain(report.id);
            expect(game.scenario).toBe(`file:${file}`);
            expect(game.currentPhase).toBe('marshal');
            expect(game.allCards.find((card) => card.name === 'Tumblestone Knight').kneeled).toBe(
                true
            );
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    });

    it('records how a problem report was made', async function () {
        const { game } = await runScenario(`${breakPath}#stops part way`, {
            users,
            logger: silentLogger
        });

        expect(game.getProblemReport('alice').source).toBe('report');
        expect(game.getProblemReport('alice', 'cancel-prompt').source).toBe('cancel-prompt');
    });

    it('passes reactions offered on the way to the reported phase', async function () {
        const { game: source } = await runScenario(`${breakPath}#stops part way`, {
            users,
            logger: silentLogger
        });
        const report = source.getProblemReport('alice');
        report.cards.push({
            id: 'the-long-voyage',
            code: '16030',
            name: 'The Long Voyage',
            packCode: 'TTWDFL',
            owner: 'alice',
            controller: 'alice',
            location: 'agenda'
        });
        report.players[0].agendas = ['the-long-voyage'];
        const problemReportService = { getById: vi.fn().mockResolvedValue(report) };

        const { game } = await runScenario(`report:${report.id}`, {
            users,
            logger: silentLogger,
            problemReportService
        });

        expect(game.currentPhase).toBe('marshal');
        expect(game.getPlayerByName('alice').agenda.name).toBe('The Long Voyage');
        expect(game.getPlayerByName('alice').faction.kneeled).toBe(false);
    });

    it('restores revealed plots without resolving their When Revealed abilities again', async function () {
        const { game: source } = await runScenario(`${breakPath}#stops part way`, {
            users,
            logger: silentLogger
        });
        const report = source.getProblemReport('alice');
        for (const reportPlayer of report.players) {
            const plot = report.cards.find((card) => card.id === reportPlayer.activePlot);
            Object.assign(plot, { code: '01010', name: 'Counting Coppers', packCode: 'Core' });
        }
        const problemReportService = { getById: vi.fn().mockResolvedValue(report) };

        const { game, error } = await runScenario(`report:${report.id}`, {
            users,
            logger: silentLogger,
            problemReportService
        });

        expect(error).toBeUndefined();
        expect(game.currentPhase).toBe('marshal');
        for (const reportPlayer of report.players) {
            const player = game.getPlayerByName(reportPlayer.name);
            expect(player.activePlot.name).toBe('Counting Coppers');
            expect(player.getReserve()).toBe(10);
            expect(player.hand.length).toBe(reportPlayer.hand.length);
            expect(player.plotDeck.length).toBe(reportPlayer.plotDeck.length);
        }
    });

    it("shows the reported game's log, including chat, instead of the rebuild's", async function () {
        const { game: source } = await runScenario(`${breakPath}#stops part way`, {
            users,
            logger: silentLogger
        });
        source.chat('alice', 'meryn did not trigger');
        const report = source.getProblemReport('alice');
        report.messages = JSON.parse(JSON.stringify(report.messages));
        const problemReportService = { getById: vi.fn().mockResolvedValue(report) };

        const { game } = await runScenario(`report:${report.id}`, {
            users,
            logger: silentLogger,
            problemReportService
        });
        const log = game.gameChat.messages.map((message) => JSON.stringify(message.message));

        expect(log.slice(0, report.messages.length)).toEqual(
            report.messages.map((message) => JSON.stringify(message.message))
        );
        expect(log.some((line) => line.includes('meryn did not trigger'))).toBe(true);
        expect(log.filter((line) => line.includes('has kept their hand'))).toHaveLength(
            report.messages.filter((message) =>
                JSON.stringify(message.message).includes('has kept their hand')
            ).length
        );
        expect(log.some((line) => line.includes('the reported game'))).toBe(true);
    });

    it('loads a problem report with as many players as the reported game', async function () {
        const { game: source } = await runScenario(`${breakPath}#stops part way`, {
            users,
            logger: silentLogger
        });
        const report = source.getProblemReport('alice');
        report.players = report.players.slice(0, 1);
        const problemReportService = { getById: vi.fn().mockResolvedValue(report) };
        const { game } = await runScenario(`report:${report.id}`, {
            users,
            logger: silentLogger,
            problemReportService
        });

        expect(game.getPlayers().map((player) => player.name)).toEqual(['alice']);
    });

    it('ignores assertions in the test', async function () {
        const { game, error } = await runScenario(`${breakPath}#ignores assertions`, {
            users,
            logger: silentLogger
        });

        expect(error).toBeUndefined();
        expect(game.allCards.find((card) => card.name === 'Tumblestone Knight').kneeled).toBe(true);
    });

    it('keeps the game when the test fails part way through', async function () {
        const { game, error } = await runScenario(`${breakPath}#reports an error`, {
            users,
            logger: silentLogger
        });

        expect(error.message).toMatch(/No such button/);
        expect(game.currentPhase).toBe('marshal');
    });

    it('lists the tests when nothing matches', async function () {
        await expect(
            runScenario(`${specPath}#no such test`, { users, logger: silentLogger })
        ).rejects.toThrow(/No test matches "no such test"[\s\S]*resolves without a prompt/);
    });
});
