import GameActions from '../../../server/game/GameActions/index.js';

describe('pile order', function () {
    describe('when killed characters have different controllers', function () {
        beforeEach(function () {
            this.setupTest({
                firstPlayer: 'player2',
                phase: 'marshal',
                player1: {
                    inPlay: ['Bronn (CoW)', 'Hedge Knight']
                },
                player2: {
                    gold: 1
                }
            });

            this.player2.clickMenu(this.bronn, 'Take control of Bronn');
            this.game.killCharacters([this.bronn, this.hedgeKnight]);
            this.game.continue();
        });

        it('lets their owner choose the dead pile order', function () {
            expect(this.player1).toHavePrompt(
                'Select order to place cards in your dead pile (top first)'
            );
            expect(this.player2).not.toHavePrompt(
                'Select order to place cards in your dead pile (top first)'
            );

            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickCard(this.bronn);
            this.player1.clickPrompt('Done');

            expect(this.player1.player.deadPile.map((card) => card.name)).toEqual([
                'Bronn',
                'Hedge Knight'
            ]);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when several cards are discarded at once', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Nightmares', 'Tithe']
                }
            });

            this.game.resolveGameAction(
                GameActions.simultaneously([
                    GameActions.discardCard({ card: this.nightmares }),
                    GameActions.discardCard({ card: this.tithe })
                ])
            );
            this.game.continue();
        });

        it('lets their owner choose the discard pile order', function () {
            expect(this.player1).toHavePrompt(
                'Select order to place cards in your discard pile (top first)'
            );

            this.player1.clickCard(this.nightmares);
            this.player1.clickCard(this.tithe);
            this.player1.clickPrompt('Done');

            expect(this.player1.player.discardPile.map((card) => card.name)).toEqual([
                'Tithe',
                'Nightmares'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
