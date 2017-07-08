/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('burn effects', function() {
    integration(function() {
        describe('when external effects are applied to a card that will be burned', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('baratheon', [
                    'Blood of the Dragon',
                    'Drogon'
                ]);
                const deck2 = this.buildDeck('thenightswatch', [
                    'Trading with the Pentoshi',
                    'The Wall', 'Messenger Raven'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.wall = this.player2.findCardByName('The Wall', 'hand');
                this.raven = this.player2.findCardByName('Messenger Raven', 'hand');

                this.completeSetup();

                this.player1.selectPlot('Blood of the Dragon');
                this.player2.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player2);

                this.player2.clickCard(this.wall);
                this.player2.clickCard(this.raven);
            });

            it('should not kill the character', function() {
                expect(this.raven.location).toBe('play area');
            });

            it('should calculate the character\'s strength correctly', function() {
                // 1 base + 1 from Wall - 1 from Blood of the Dragon = 1
                expect(this.raven.getStrength()).toBe(1);
            });
        });

        describe('when effects are self-applied to a card that will be burned', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('baratheon', [
                    'Blood of the Dragon',
                    'Drogon'
                ]);
                const deck2 = this.buildDeck('thenightswatch', [
                    'Trading with the Pentoshi',
                    'Hedge Knight', 'Silent Sisters'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.knight = this.player2.findCardByName('Hedge Knight', 'hand');
                this.sisters = this.player2.findCardByName('Silent Sisters', 'hand');

                this.completeSetup();

                this.player1.selectPlot('Blood of the Dragon');
                this.player2.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player2);

                // Move character to dead pile to give Silent Sisters +1 STR.
                this.player2.dragCard(this.knight, 'dead pile');

                this.player2.clickCard(this.sisters);
            });

            it('should not kill the character', function() {
                expect(this.sisters.location).toBe('play area');
            });

            it('should calculate the character\'s strength correctly', function() {
                // 1 base + 1 from dead pile - 1 from Blood of the Dragon = 1
                expect(this.sisters.getStrength()).toBe(1);
            });
        });
    });
});
