import Player from '../../../server/game/player.js';

describe('the Player', () => {
    describe('shuffleDrawDeck()', () => {
        beforeEach(() => {
            this.player = new Player('1', { username: 'Player 1', settings: {} }, true, {
                raiseEvent: vi.fn()
            });
            this.player.drawDeck = [{ name: 'foo' }, { name: 'bar' }];
        });

        it('counts each shuffle, so a client can tell when the deck was shuffled', () => {
            expect(this.player.deckShuffles).toBe(0);

            this.player.shuffleDrawDeck();
            this.player.shuffleDrawDeck();

            expect(this.player.deckShuffles).toBe(2);
        });
    });
});
