/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('playing events', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('baratheon', [
                'Trading with the Pentoshi',
                'Melisandre (Core)', 'Seen In Flames', 'The Hand\'s Judgment', 'Tears of Lys', 'Hedge Knight'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.knight = this.player2.findCardByName('Hedge Knight', 'hand');

            this.player1.clickCard('Melisandre', 'hand');
            this.player2.clickCard(this.knight);

            this.completeSetup();

            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.completeMarshalPhase();
        });

        describe('when playing an Action event', function() {
            beforeEach(function() {
                this.player1.clickCard('Seen In Flames');
                this.player2.clickPrompt('Pass');

                // Discard Melisandre from the opponent's hand
                this.player2.clickPrompt('Yes');
                this.player1.clickPrompt('Melisandre');
            });

            it('should count as having played the event', function() {
                expect(this.player1).toHavePromptButton('Melisandre');

                this.player1.clickPrompt('Melisandre');
                this.player1.clickCard(this.knight);

                expect(this.knight.kneeled).toBe(true);
            });
        });

        describe('when cancelling the effects of an event', function() {
            beforeEach(function() {
                this.player1.clickCard('Seen In Flames');
                this.player2.clickPrompt('The Hand\'s Judgment');
            });

            it('should still count as having played the event', function() {
                expect(this.player1).toHavePromptButton('Melisandre');

                this.player1.clickPrompt('Melisandre');
                this.player1.clickCard(this.knight);

                expect(this.knight.kneeled).toBe(true);
            });
        });
    });
});
