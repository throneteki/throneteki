/* global describe, it, beforeEach, expect, jasmine */
/* eslint camelcase: 0, no-invalid-this: 0 */

const Player = require('../../../server/game/player.js');
const DrawCard = require('../../../server/game/drawcard.js');

describe('Player', function() {
    describe('moveCard', function() {
        beforeEach(function() {
            this.player = new Player('1', 'Player 1', true);
            this.player.initialise();

            this.card = new DrawCard(this.player, { code: '1', name: 'Test' });
        });

        describe('when the card is not in a pile', function() {
            beforeEach(function() {
                this.card.location = '';
            });

            it('should add the card to the player hand', function() {
                this.player.moveCard(this.card, 'hand');
                expect(this.player.hand).toContain(this.card);
                expect(this.card.location).toBe('hand');
            });

            it('should add the card to the player discard pile', function() {
                this.player.moveCard(this.card, 'discard pile');
                expect(this.player.discardPile).toContain(this.card);
                expect(this.card.location).toBe('discard pile');
            });

            it('should add the card to the player dead pile', function() {
                this.player.moveCard(this.card, 'dead pile');
                expect(this.player.deadPile).toContain(this.card);
                expect(this.card.location).toBe('dead pile');
            });

            it('should add the card to the player play area', function() {
                this.player.moveCard(this.card, 'play area');
                expect(this.player.cardsInPlay).toContain(this.card);
                expect(this.card.location).toBe('play area');
            });
        });

        describe('when the card is in a pile', function() {
            beforeEach(function() {
                // Start it in the discard pile
                this.player.moveCard(this.card, 'discard pile');

                this.player.moveCard(this.card, 'hand');
            });

            it('should move it to the target pile', function() {
                expect(this.player.hand).toContain(this.card);
            });

            it('should remove it from the original pile', function() {
                expect(this.player.discardPile).not.toContain(this.card);
            });
        });
    });
});
