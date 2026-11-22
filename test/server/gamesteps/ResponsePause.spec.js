import PossibleResponders from '../../../server/game/PossibleResponders.js';
import { deckBuilder } from '../../helpers/cards.js';

describe('stopping response waits for the rest of the phase', function () {
    const PauseButton = "Don't ask again this phase";

    function setup(context, player2Hand) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                actionWindows: { dominance: true },
                hand: [
                    'Hear Me Roar!',
                    'Hear Me Roar!',
                    'Lannisport Merchant',
                    'Ser Jaime Lannister (Core)'
                ]
            },
            player2: { faction: 'lannister', gold: 5, hand: player2Hand }
        });

        context.game.possibleResponders = new PossibleResponders(context.game, {
            cardData: [deckBuilder.getCard("The Hand's Judgment")]
        });
        context.scheduled = [];
        context.game.schedule = (delay, callback) => context.scheduled.push({ delay, callback });

        [context.firstRoar, context.secondRoar] = context.player1.filterCardsByName(
            'Hear Me Roar!',
            'hand'
        );
    }

    function playRoar(context, roar, character) {
        context.player1.clickCard(roar);
        context.player1.clickCard(character);
    }

    describe('when they hold a cancel', function () {
        beforeEach(function () {
            setup(this, ["The Hand's Judgment"]);
            playRoar(this, this.firstRoar, this.lannisportMerchant);
        });

        it('offers the button with the cancel', function () {
            expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");
            expect(this.player2).toHavePromptButton(PauseButton);
        });

        describe('and they use it', function () {
            beforeEach(function () {
                this.player2.clickPrompt(PauseButton);
                playRoar(this, this.secondRoar, this.serJaimeLannister);
            });

            it('still asks them while they hold a cancel, without the button', function () {
                expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");
                expect(this.player2).not.toHavePromptButton(PauseButton);
            });
        });

        describe('and they pass without it', function () {
            beforeEach(function () {
                this.player2.clickPrompt('Pass');
                playRoar(this, this.secondRoar, this.serJaimeLannister);
            });

            it('asks them again', function () {
                expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");
            });
        });

        describe('and they use it, then the phase ends', function () {
            beforeEach(function () {
                this.player2.clickPrompt(PauseButton);
                this.completeChallengesPhase();
                playRoar(this, this.secondRoar, this.serJaimeLannister);
            });

            it('asks them again in the next phase', function () {
                expect(this.game.currentPhase).toBe('dominance');
                expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");
            });
        });
    });

    describe('when they hold no cancel', function () {
        beforeEach(function () {
            setup(this, []);
            playRoar(this, this.firstRoar, this.lannisportMerchant);
        });

        it('offers the button on the wait', function () {
            expect(this.player2).toHavePromptButton(PauseButton);
        });

        it('does not log a message when they use it', function () {
            const addMessage = vi.spyOn(this.game, 'addMessage');

            this.player2.clickPrompt(PauseButton);

            expect(addMessage).not.toHaveBeenCalledWith(
                expect.stringContaining('response waits'),
                expect.anything()
            );
            expect(addMessage).not.toHaveBeenCalledWith(
                expect.anything(),
                this.player2.player
            );
            expect(this.player1).isReadyToTakeAction();
        });

        describe('and they use it', function () {
            beforeEach(function () {
                this.player2.clickPrompt(PauseButton);
                playRoar(this, this.secondRoar, this.serJaimeLannister);
            });

            it('does not give them a wait again this phase', function () {
                expect(this.lannisportMerchant.location).toBe('play area');
                expect(this.serJaimeLannister.location).toBe('play area');
                expect(this.scheduled).toHaveLength(1);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
