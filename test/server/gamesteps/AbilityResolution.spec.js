import GameActions from '../../../server/game/GameActions/index.js';

describe('ability resolution', function () {
    describe('targets chosen while initiating', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Hedge Knight', { card: 'House Maester', kneeling: true }]
                }
            });

            this.hedgeKnight.action({
                title: 'Kill a standing character',
                cost: {
                    canPay: () => true,
                    pay: (context) => {
                        context.game.resolveGameAction(
                            GameActions.standCard({ card: this.houseMaester })
                        );
                    }
                },
                target: {
                    cardCondition: (card) =>
                        card.getType() === 'character' &&
                        card.location === 'play area' &&
                        !card.kneeled,
                    gameAction: 'kill'
                },
                gameAction: GameActions.genericHandler(
                    (context) => {
                        this.chosen = context.target;
                    },
                    () => true
                )
            });
        });

        it('keeps the choice to the cards that were legal when the ability was initiated', function () {
            this.player1.clickMenu(this.hedgeKnight, 'Kill a standing character');

            expect(this.houseMaester.kneeled).toBe(false);
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);

            this.player1.clickCard(this.hedgeKnight);
            expect(this.chosen).toBe(this.hedgeKnight);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when no legal target remains', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Hedge Knight', 'House Maester'],
                    hand: ['Nightmares']
                }
            });

            this.nightmares.abilities.actions.length = 0;
            this.nightmares.action({
                title: 'Kill the knight',
                cost: {
                    canPay: () => true,
                    pay: (context) => {
                        context.costs.gold = 0;
                        context.game.resolveGameAction(
                            GameActions.kill({ card: this.hedgeKnight, allowSave: false })
                        );
                    }
                },
                target: {
                    cardCondition: (card) =>
                        card === this.hedgeKnight && card.location === 'play area',
                    gameAction: 'kneel'
                },
                gameAction: GameActions.genericHandler(
                    () => {
                        this.resolved = true;
                    },
                    () => true
                )
            });
        });

        it('resolves unsuccessfully and still plays the event', function () {
            this.player1.clickCard(this.nightmares);

            expect(this.resolved).toBeUndefined();
            expect(this.hedgeKnight.location).toBe('dead pile');
            expect(this.nightmares.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                "player1's Nightmares resolves unsuccessfully"
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('an effect that chooses any number', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Hedge Knight', 'House Maester']
                }
            });

            this.hedgeKnight.action({
                title: 'Choose any number',
                target: {
                    mode: 'unlimited',
                    cardCondition: (card) => card.getType() === 'character'
                },
                gameAction: GameActions.genericHandler(
                    () => {
                        this.resolved = true;
                    },
                    () => true
                )
            });
        });

        it('does not resolve when zero are chosen', function () {
            this.player1.clickMenu(this.hedgeKnight, 'Choose any number');
            this.player1.clickPrompt('Done');

            expect(this.resolved).toBeUndefined();
            expect(this.game.getPlainTextLog()).toContain(
                "player1's Hedge Knight resolves unsuccessfully"
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('a cost prevented while it is being paid', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Hedge Knight', 'House Maester']
                }
            });

            this.hedgeKnight.action({
                title: 'Kneel to act',
                cost: {
                    canPay: () => !this.hedgeKnight.kneeled,
                    resolve: (context, result = { resolved: false }) => {
                        context.addCost('kneel', context.source);
                        result.resolved = true;
                        result.value = context.source;
                        return result;
                    },
                    pay: (context) => {
                        context.game.resolveGameAction(
                            GameActions.kneelCard({ card: this.hedgeKnight, reason: 'cost' })
                        );
                    }
                },
                gameAction: GameActions.genericHandler(
                    () => {
                        this.resolved = true;
                    },
                    () => true
                )
            });
            this.houseMaester.interrupt({
                when: {
                    onCardKneeled: (event) =>
                        event.card === this.hedgeKnight && event.reason === 'cost'
                },
                gameAction: GameActions.genericHandler(
                    (context) => {
                        context.event.cancel();
                    },
                    () => true
                )
            });
            this.houseMaester.abilities.reactions.at(-1).registerEvents();
        });

        it('ends initiation once the costs that can be paid have been paid', function () {
            this.player1.clickMenu(this.hedgeKnight, 'Kneel to act');
            this.player1.triggerAbility(this.houseMaester);

            expect(this.resolved).toBeUndefined();
            expect(this.hedgeKnight.kneeled).toBe(false);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 fails to initiate Hedge Knight because a cost was prevented'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
