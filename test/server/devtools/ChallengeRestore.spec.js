import { runScenario } from '../../../server/devtools/scenario/runner.js';

const users = [{ username: 'alice' }, { username: 'bob' }];

describe('restoring a challenge from a problem report', function () {
    async function replay(context) {
        const report = context.game.getProblemReport('player1');
        const problemReportService = { getById: async () => report };
        const { game } = await runScenario(`report:${report.id}`, {
            users,
            problemReportService
        });
        const card = (name) => game.allCards.find((card) => card.name === name);
        const prompt = (player) => game.getPlayerByName(player).currentPrompt();
        return { game, card, prompt };
    }

    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tumblestone Knight', 'Hedge Knight'] },
            player2: { faction: 'baratheon', inPlay: ['Bastard in Hiding'] }
        });
    });

    describe('after attackers are declared', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
        });

        it('resumes at the action window after attackers were declared', async function () {
            const { game, card, prompt } = await replay(this);

            expect(game.currentChallenge.challengeType).toBe('military');
            expect(game.currentChallenge.attackers).toEqual([card('Tumblestone Knight')]);
            expect(card('Tumblestone Knight').kneeled).toBe(true);
            expect(game.getPlainTextLog()).toContain(
                'Restored the military challenge at the action window after attackers were declared'
            );

            expect(prompt('alice').promptTitle).toBe('After attackers declared');
            for (const player of ['alice', 'bob']) {
                const pass = prompt(player).buttons.find((button) => button.text === 'Pass');
                game.menuButton(player, pass.arg, pass.method, pass.promptId);
                game.continue();
            }

            expect(prompt('bob').menuTitle).toBe('Select defenders');
        });
    });

    describe('after defenders are declared, with an earlier challenge', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');
        });

        it('resumes at the action window after defenders were declared', async function () {
            const { game, card } = await replay(this);

            expect(game.currentChallenge.attackers).toEqual([card('Hedge Knight')]);
            expect(game.currentChallenge.defenders).toEqual([card('Bastard in Hiding')]);
            expect(game.currentChallenge.number).toBe(2);
            expect(game.getPlainTextLog()).toContain(
                'Restored the military challenge at the action window after defenders were declared'
            );
        });

        it('counts the earlier challenge as made', async function () {
            const { game } = await replay(this);

            const used = (type) =>
                game
                    .getPlayerByName('alice')
                    .challenges.allowedChallenges.find(
                        (allowance) => allowance.challengeType === type
                    ).used;
            expect(used('power')).toBe(true);
            expect(used('military')).toBe(true);
            expect(used('intrigue')).toBe(false);
        });
    });
});
