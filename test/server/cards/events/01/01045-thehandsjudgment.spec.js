/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('The Hand\'s Judgment', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('lannister', [
                'A Noble Cause',
                'The Hand\'s Judgment', 'Hear Me Roar!', 'Ser Jaime Lannister (Core)'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();

            this.character = this.player1.findCardByName('Ser Jaime Lannister', 'hand');

            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
        });

        describe('when an event is played', function() {
            beforeEach(function() {
                this.player1.clickCard('Hear Me Roar!', 'hand');
                expect(this.player1).toHavePrompt('Select character');
                this.player1.clickCard(this.character);
            });

            it('should prompt to play Judgment', function() {
                expect(this.player2).toHavePromptButton('The Hand\'s Judgment');
            });

            describe('and Judgment is used to cancel the event', function() {
                beforeEach(function() {
                    this.player2.clickPrompt('The Hand\'s Judgment');
                    this.player1.clickPrompt('Pass');
                });

                it('should cancel the resolution of the original event', function() {
                    expect(this.character.location).not.toBe('play area');
                });

                it('should cost the same as the original event', function() {
                    // 5 gold from plot - 1 gold for Judgment
                    expect(this.player2Object.gold).toBe(4);
                });
            });

            describe('and Judgment is cancelled by Judgment', function() {
                beforeEach(function() {
                    this.player2.clickPrompt('The Hand\'s Judgment');
                    this.player1.clickPrompt('The Hand\'s Judgment');
                });

                it('should allow the effects of the original event', function() {
                    expect(this.character.location).toBe('play area');
                });

                it('should cost 0', function() {
                    // 5 gold from plot - 1 gold from Hear Me Roar - 0 gold from Judgment
                    expect(this.player1Object.gold).toBe(4);
                });
            });
        });
    });
});
