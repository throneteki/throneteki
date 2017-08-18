/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('leaving play', function() {
    integration(function() {
        describe('when a lasting effect has been applied to the card', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('thenightswatch', [
                    'Trading with the Pentoshi',
                    'Old Bear Mormont (Core)'
                ]);
                const deck2 = this.buildDeck('baratheon', [
                    'Trading with the Pentoshi',
                    'Drogon', 'Dracarys!'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Old Bear Mormont', 'hand');

                this.player1.clickCard(this.character);
                this.player2.clickCard('Drogon', 'hand');

                this.completeSetup();

                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');

                this.player1.clickPrompt('Pass');
                this.player2.clickCard('Dracarys!');
                this.player2.clickCard('Drogon', 'play area');
                this.player2.clickCard(this.character);

                expect(this.character.getStrength()).toBe(2);

                this.player1.dragCard(this.character, 'hand');
                this.player1.dragCard(this.character, 'play area');
            });

            it('should reset the lasting effect', function() {
                expect(this.character.getStrength()).toBe(6);
            });
        });
    });
});
