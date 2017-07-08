/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Arya\'s Gift', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('stark', [
                'A Noble Cause',
                'Winterfell Steward', 'Bran Stark', 'Milk of the Poppy', 'Arya\'s Gift'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.character1 = this.player1.findCardByName('Bran Stark', 'hand');
            this.character2 = this.player1.findCardByName('Winterfell Steward', 'hand');

            this.milk = this.player2.findCardByName('Milk of the Poppy', 'hand');

            this.player1.clickCard(this.character1);
            this.player1.clickCard(this.character2);

            this.completeSetup();

            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player2);

            // Attach Milk to the first character.
            this.player2.clickCard(this.milk);
            this.player2.clickCard(this.character1);

            this.completeMarshalPhase();
        });

        describe('when played', function() {
            beforeEach(function() {
                this.player1.clickCard('Arya\'s Gift', 'hand');
                this.player1.clickCard(this.milk);
                this.player1.clickCard(this.character2);
            });

            it('should move the attachment to the new parent', function() {
                expect(this.milk.parent).toBe(this.character2);
            });

            it('should apply effects to the new parent', function() {
                expect(this.character2.isBlank()).toBe(true);
            });

            it('should unapply effects from the old parent', function() {
                expect(this.character1.isBlank()).toBe(false);
            });
        });
    });
});
