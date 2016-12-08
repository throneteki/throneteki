/*global describe, it, beforeEach, expect*/
/* eslint camelcase: 0 */

const _ = require('underscore');
const Player = require('../../../server/game/player.js');

describe('the Player', function() {
    beforeEach(function() {
        this.drawDeck = [
            { uuid: '1111', location: 'draw deck' },
            { uuid: '2222', location: 'draw deck' },
            { uuid: '333', location: 'draw deck' }
        ];

        this.player = new Player('1', 'Player 1', true);
        this.player.initialise();
        this.player.drawDeck = _(this.drawDeck);
        this.player.hand = _([]);

        this.cardToMove = this.drawDeck[1];
    });

    describe('the moveFromDrawDeckToHand() function', function() {
        it('should add the card to the players hand', function() {
            this.player.moveFromDrawDeckToHand(this.cardToMove);

            expect(this.player.hand).toContain(this.cardToMove);
        });

        it('should remove the card from the draw deck', function() {
            this.player.moveFromDrawDeckToHand(this.cardToMove);

            expect(this.player.drawDeck).not.toContain(this.cardToMove);
        });
    });
});
