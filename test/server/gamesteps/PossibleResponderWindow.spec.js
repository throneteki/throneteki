import PossibleResponders from '../../../server/game/PossibleResponders.js';
import { deckBuilder } from '../../helpers/cards.js';

describe('cancel windows for a player without the timer', function () {
    function setup(context, { player2Hand = [], pool = ["The Hand's Judgment", 'Hear Me Roar!'] }) {
        context.setupTest({
            phase: 'challenge',
            player1: { faction: 'lannister', hand: ['Hear Me Roar!', 'Lannisport Merchant'] },
            player2: { faction: 'stark', gold: 5, hand: player2Hand }
        });

        context.game.possibleResponders = new PossibleResponders(context.game, {
            cardData: pool.map((name) => deckBuilder.getCard(name))
        });
        context.scheduled = [];
        context.game.schedule = (delay, callback) => context.scheduled.push({ delay, callback });
        context.stateSent = 0;
        context.game.on('sendGameState', () => context.stateSent++);
    }

    function playRoar(context) {
        context.player1.clickCard(context.hearMeRoar);
        context.player1.clickCard(context.lannisportMerchant);
    }

    const WindowTitle = 'Any interrupts to the effects of Hear Me Roar!?';

    // What the event's player can see of the window: their own prompt, and whether their
    // opponent's prompt is active.
    function opponentView(context) {
        return {
            prompt: context.player1.formatPrompt(),
            opponentActive: context.player2.player.getState(context.player1.player).isActivePrompt
        };
    }

    const ViewWhileConsidering = { prompt: 'Waiting for opponent\n', opponentActive: true };

    describe('when a card they could hold might cancel the event', function () {
        describe('and they hold one', function () {
            beforeEach(function () {
                setup(this, { player2Hand: ["The Hand's Judgment"] });
                playRoar(this);
            });

            it('looks the same to their opponent as when they hold none', function () {
                expect(opponentView(this)).toEqual(ViewWhileConsidering);
            });

            it('prompts them to use it, without passing for them', function () {
                expect(this.player2).toHavePrompt(WindowTitle);
                expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");
                expect(this.scheduled).toHaveLength(0);
            });
        });

        describe('and they hold none', function () {
            beforeEach(function () {
                setup(this, {});
                playRoar(this);
            });

            it('looks the same to their opponent as when they hold one', function () {
                expect(opponentView(this)).toEqual(ViewWhileConsidering);
            });

            it('shows them the same window, with nothing to choose', function () {
                expect(this.player2).toHavePrompt(WindowTitle);
                expect(this.player2).toHavePromptButton('Pass');
                expect(this.player2.player.promptState.isActivePrompt).toBe(true);
                expect(this.lannisportMerchant.location).toBe('hand');
            });

            it('passes for them after a short random delay', function () {
                expect(this.scheduled).toHaveLength(1);
                expect(this.scheduled[0].delay).toBeGreaterThanOrEqual(1000);
                expect(this.scheduled[0].delay).toBeLessThan(3000);

                this.scheduled[0].callback();

                expect(this.lannisportMerchant.location).toBe('play area');
                expect(this.stateSent).toBe(1);
                expect(this.player1).isReadyToTakeAction();
            });

            it('lets them pass before the delay ends', function () {
                this.player2.clickPrompt('Pass');

                expect(this.lannisportMerchant.location).toBe('play area');

                this.scheduled[0].callback();

                expect(this.lannisportMerchant.location).toBe('play area');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('when no card they could hold might cancel the event', function () {
        beforeEach(function () {
            setup(this, { pool: ['Hear Me Roar!'] });
            playRoar(this);
        });

        it('skips the window', function () {
            expect(this.scheduled).toHaveLength(0);
            expect(this.lannisportMerchant.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when they use the cancel timer', function () {
        beforeEach(function () {
            setup(this, {});
            this.player2.player.noTimer = false;
            playRoar(this);
        });

        it('shows the timer prompt as before', function () {
            expect(this.player2).toHavePromptButton("Don't ask again until end of round");
            expect(this.scheduled).toHaveLength(0);
        });
    });
});
