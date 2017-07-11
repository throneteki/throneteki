/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Craster', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('thenightswatch', [
                'A Noble Cause', 'Called Into Service',
                'Craster', 'Steward at the Wall', 'Old Forest Hunter'
            ]);
            const deck2 = this.buildDeck('thenightswatch', [
                'Valar Morghulis',
                'Benjen Stark', 'Steward at the Wall', 'Old Forest Hunter'
            ]);

            this.player1.togglePromptedActionWindow('plot', true);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.craster = this.player1.findCardByName('Craster', 'hand');
            this.character = this.player1.findCardByName('Steward at the Wall', 'hand');

            this.opponentCharacter = this.player2.findCardByName('Steward at the Wall', 'hand');

        });

        describe('while Craster is out when characters are killed', function() {
            beforeEach(function() {
                this.benjen = this.player2.findCardByName('Benjen Stark', 'hand');

                this.player1.clickCard(this.craster);
                this.player1.clickCard(this.character);
                this.player2.clickCard(this.benjen);
                this.player2.clickCard(this.opponentCharacter);
                this.completeSetup();
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('Valar Morghulis');
                this.selectFirstPlayer(this.player1);

                this.player2.clickPrompt('Benjen Stark');
                expect(this.benjen.location).toBe('draw deck');
            });

            describe('when sacrificing Craster in the same phase', function() {
                beforeEach(function() {
                    this.player1.clickMenu(this.craster, 'Sacrifice to resurrect');
                });

                it('should put your dead pile cards into play', function() {
                    expect(this.character.location).toBe('play area');
                });

                it('should put opponent dead pile cards into play', function() {
                    expect(this.opponentCharacter.location).toBe('play area');
                });

                it('should not put killed characters not in dead pile into play', function() {
                    expect(this.benjen.location).not.toBe('play area');
                });
            });

            describe('when sacrificing Craster in the following phase', function() {
                beforeEach(function() {
                    // Clear plot phase by passing on the action window.
                    this.player1.clickPrompt('Done');

                    this.player1.clickMenu(this.craster, 'Sacrifice to resurrect');
                });

                it('should not resurrect any cards', function() {
                    expect(this.character.location).toBe('dead pile');
                    expect(this.opponentCharacter.location).toBe('dead pile');
                    expect(this.benjen.location).not.toBe('play area');
                });
            });
        });

        describe('when Craster comes out after characters are killed', function() {
            beforeEach(function() {
                this.player1.clickCard(this.character);
                this.player2.clickCard(this.opponentCharacter);
                this.completeSetup();

                // Move Craster to the top of draw deck to put him into play with Called Into Service.
                this.player1Object.moveCard(this.craster, 'draw deck');

                this.player1.selectPlot('Called Into Service');
                this.player2.selectPlot('Valar Morghulis');
                this.selectFirstPlayer(this.player1);
                // Resolve Valar before Called Into Service.
                this.selectPlotOrder(this.player2);

                expect(this.craster.location).toBe('play area');
                this.player1.clickMenu(this.craster, 'Sacrifice to resurrect');
            });

            it('should put your dead pile cards into play', function() {
                expect(this.character.location).toBe('play area');
            });

            it('should put opponent dead pile cards into play', function() {
                expect(this.opponentCharacter.location).toBe('play area');
            });
        });
    });
});
