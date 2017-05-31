/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('faction change', function() {
    integration(function() {
        describe('when using an attachment to gain faction affiliation', function() {
            beforeEach(function() {
                const deck = this.buildDeck('thenightswatch', [
                    'Sneak Attack', 'Confiscation',
                    'Hedge Knight', 'Sworn to the Watch', 'The Wall'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight', 'hand');

                this.player1.clickCard('The Wall', 'hand');
                this.player1.clickCard(this.character);
                this.player1.clickCard('Sworn to the Watch', 'hand');

                this.completeSetup();

                this.player1.clickCard('Sworn to the Watch', 'play area');
                this.player1.clickCard(this.character);
            });

            it('should grant faction affiliation', function() {
                expect(this.character.isFaction('thenightswatch')).toBe(true);
            });

            it('should recalculate effects for that card', function() {
                // 2 STR base + 1 STR from the Wall
                expect(this.character.getStrength()).toBe(3);
            });

            describe('when the attachment is removed', function() {
                beforeEach(function() {
                    this.player1.selectPlot('Confiscation');
                    this.player2.selectPlot('Sneak Attack');
                    this.selectFirstPlayer(this.player1);

                    // Discard Sworn to the Watch with Confiscation
                    this.player1.clickCard('Sworn to the Watch', 'play area');
                });

                it('should lose faction affiliation', function() {
                    expect(this.character.isFaction('thenightswatch')).toBe(false);
                });

                it('should recalculate effects for that card', function() {
                    // 2 STR base, no more bonus from the Wall.
                    expect(this.character.getStrength()).toBe(2);
                });
            });
        });
    });
});
