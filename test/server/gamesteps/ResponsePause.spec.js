import PossibleResponders from '../../../server/game/PossibleResponders.js';
import { deckBuilder } from '../../helpers/cards.js';

describe('not being asked about responses for the rest of the phase', function () {
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

            it('does not ask them again this phase, even with a legal cancel', function () {
                expect(this.lannisportMerchant.location).toBe('play area');
                expect(this.serJaimeLannister.location).toBe('play area');
                expect(this.theHandsJudgment.location).toBe('hand');
                expect(this.player1).isReadyToTakeAction();
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

        describe('and they use it', function () {
            beforeEach(function () {
                this.player2.clickPrompt(PauseButton);
                playRoar(this, this.secondRoar, this.serJaimeLannister);
            });

            it('behaves exactly as it does for a player holding a cancel', function () {
                expect(this.lannisportMerchant.location).toBe('play area');
                expect(this.serJaimeLannister.location).toBe('play area');
                expect(this.scheduled).toHaveLength(1);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('when they can respond with a card their opponents can see', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    faction: 'stark',
                    inPlay: ['Northern Patriarch'],
                    hand: ["The Hand's Judgment"]
                },
                player2: {
                    faction: 'lannister',
                    gold: 5,
                    hand: [
                        'Hear Me Roar!',
                        'Hear Me Roar!',
                        'Lannisport Merchant',
                        'Ser Jaime Lannister (Core)'
                    ]
                }
            });
            [this.firstRoar, this.secondRoar] = this.player2.filterCardsByName(
                'Hear Me Roar!',
                'hand'
            );
            this.player2.clickCard(this.firstRoar);
            this.player2.clickCard(this.lannisportMerchant);
            this.player1.clickPrompt(PauseButton);
            this.player2.clickCard(this.secondRoar);
            this.player2.clickCard(this.serJaimeLannister);
        });

        it('still asks them about that card, but not the cards in their hand', function () {
            expect(this.player1).toAllowAbilityTrigger(this.northernPatriarch);
            expect(this.player1).not.toAllowAbilityTrigger("The Hand's Judgment");
        });
    });
});
