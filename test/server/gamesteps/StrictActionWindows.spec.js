import PossibleResponders from '../../../server/game/PossibleResponders.js';
import { deckBuilder } from '../../helpers/cards.js';

describe('strict action windows', function () {
    function setup(context, { player2Hand = [], player2Gold } = {}) {
        context.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', hand: [], inPlay: ['Lannisport Merchant'] },
            player2: { faction: 'stark', hand: player2Hand }
        });

        context.game.strictActionWindows = true;
        context.game.possibleResponders = new PossibleResponders(context.game, {
            cardData: [deckBuilder.getCard('Nightmares')]
        });
        context.scheduled = [];
        context.game.schedule = (delay, callback) => context.scheduled.push({ delay, callback });

        context.player1.clickPrompt('Done');
        if (player2Gold !== undefined) {
            context.player2.player.gold = player2Gold;
        }
        context.player2.clickPrompt('Done');
    }

    function opponentView(context) {
        return {
            prompt: context.player1.formatPrompt(),
            opponentActive: context.player2.player.getState(context.player1.player).isActivePrompt
        };
    }

    const ViewWhileConsidering = { prompt: 'Waiting for opponent\n', opponentActive: true };

    describe('when a player holds an action they can take', function () {
        beforeEach(function () {
            setup(this, { player2Hand: ['Nightmares'] });
        });

        it('prompts them, without passing for them', function () {
            expect(this.player2).toHavePrompt('Initiate an action');
            expect(this.player2.player.promptState.controls).toEqual([]);
            expect(this.scheduled).toHaveLength(0);
        });

        it('looks the same to their opponent as when they hold none', function () {
            expect(opponentView(this)).toEqual(ViewWhileConsidering);
        });
    });

    describe('when a player could hold an action but does not', function () {
        beforeEach(function () {
            setup(this, { player2Hand: ['Winterfell Steward'] });
        });

        it('shows them the same prompt with a delay', function () {
            expect(this.player2).toHavePrompt('Initiate an action');
            expect(this.player2.player.promptState.controls).toContainEqual(
                expect.objectContaining({
                    type: 'response-delay',
                    duration: this.scheduled[0].delay
                })
            );
        });

        it('looks the same to their opponent as when they hold one', function () {
            expect(opponentView(this)).toEqual(ViewWhileConsidering);
        });

        it('passes for them after the delay', function () {
            this.scheduled[0].callback();

            expect(this.player2).not.toHavePrompt('Initiate an action');
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets them pass sooner', function () {
            this.player2.clickPrompt('Pass');
            this.scheduled[0].callback();

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when no card a player could hold gives them an action', function () {
        it('skips them when their hand is empty', function () {
            setup(this);

            expect(this.scheduled).toHaveLength(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('skips them when they cannot afford one', function () {
            setup(this, { player2Hand: ['Winterfell Steward'], player2Gold: 0 });

            expect(this.scheduled).toHaveLength(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a player has chosen to stop at the window', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { faction: 'lannister', hand: [], inPlay: ['Lannisport Merchant'] },
                player2: { faction: 'stark', hand: [] }
            });
            this.game.strictActionWindows = true;
            this.player2.togglePromptedActionWindow('challengeBegin', true);

            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
        });

        it('prompts them although they have nothing to use', function () {
            expect(this.player2).toHavePrompt('Initiate an action');
        });
    });

    describe('with manual mode off', function () {
        beforeEach(function () {
            setup(this, { player2Hand: ['Nightmares'] });
            this.game.manualMode.enabled = false;
        });

        it('allows the action in their turn in the window', function () {
            expect(this.player2.actionUnavailableReason(this.nightmares)).toBeUndefined();
        });

        it('refuses it outside an action window', function () {
            this.player2.clickPrompt('Pass');

            expect(this.player2.actionUnavailableReason(this.nightmares)).toBe('window');
        });
    });

    describe('with the option off', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Lannisport Merchant'] },
                player2: { hand: ['Nightmares'] }
            });
            this.game.manualMode.enabled = false;

            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
        });

        it('allows actions outside action windows', function () {
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2.actionUnavailableReason(this.nightmares)).toBeUndefined();
        });
    });
});
