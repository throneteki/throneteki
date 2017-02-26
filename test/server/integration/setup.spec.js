/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('setup phase', function() {
    integration(function() {
        describe('when attachments are put out in the setup phase', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', ['Red God\'s Blessing', 'Dragonstone Faithful']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Dragonstone Faithful');
                this.attachment = this.player1.findCardByName('Red God\'s Blessing');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.attachment);

                this.completeSetup();
            });

            it('should prompt the user to attach stray attachments', function() {
                expect(this.player1).toHavePrompt('Select attachment locations');
            });

            describe('when the attachments have been placed', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.attachment);
                    this.player1.clickCard(this.character);
                });

                it('should attach to the selected card', function() {
                    expect(this.character.attachments).toContain(this.attachment);
                });

                it('should properly calculate the effects of the attachment', function() {
                    expect(this.character.getStrength()).toBe(2);
                });

                it('should continue to the plot phase', function() {
                    expect(this.player1).toHavePrompt('Select a plot');
                });
            });
        });

        describe('when dupes are put out in the setup phase', function() {
            beforeEach(function() {
                const deck = this.buildDeck('thenightswatch', ['The Wall', 'The Wall', 'Steward at the Wall']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.wall1, this.wall2] = this.player1.filterCardsByName('The Wall');
                this.character = this.player1.findCardByName('Steward at the Wall');

                this.player1.clickCard(this.wall1);
                this.player1.clickCard(this.wall2);
                this.player1.clickCard(this.character);
            });

            it('should not count duplicates toward character strength', function() {
                this.completeSetup();

                expect(this.wall1.dupes.size()).toBe(1);
                expect(this.player1Object.cardsInPlay.size()).toBe(2);
                expect(this.character.getStrength()).toBe(2);
            });

            it('should allow dupes to be dragged back to hand', function() {
                this.player1.dragCard(this.wall2, 'hand');

                expect(this.wall2.location).toBe('hand');
                expect(this.player1Object.cardsInPlay).not.toContain(this.wall2);
            });
        });
    });
});
