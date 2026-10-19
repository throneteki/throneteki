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
        const { game } = await runScenario(`${specPath}#allows any attachment`, {
            users,
            logger: silentLogger
        });

        expect(game.getPlayerByName('alice').currentPrompt().menuTitle).toBe(
            'Select an attachment'
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
