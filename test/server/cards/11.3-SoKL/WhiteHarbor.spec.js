describe('White Harbor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['White Harbor', 'Hedge Knight'],
                drawDeck: ['Castle Guard', 'The Roseroad']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('White Harbor');
        this.player2.clickCard(this.theRoseroad);
    });

    it('reveals the top 2 cards after you win, adding the one the losing opponent chooses to your hand', function () {
        expect(this.theRoseroad.location).toBe('hand');
        const deck = this.player1Object.drawDeck;
        expect(deck[deck.length - 1]).toBe(this.castleGuard);
    });
});
