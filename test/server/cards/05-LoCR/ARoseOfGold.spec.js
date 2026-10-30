describe('"A Rose of Gold"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['"A Rose of Gold"'],
                drawDeck: ['Hedge Knight', 'Castle Guard', 'The Roseroad', 'The Kingsroad'],
                gold: 1
            }
        });
        this.player1.clickCard(this.aRoseOfGold);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
    });

    it('adds 1 of the top 3 cards of your deck to your hand and places the others on the bottom', function () {
        const deck = this.player1Object.drawDeck;
        expect(this.castleGuard.location).toBe('hand');
        expect(deck[0]).toBe(this.theKingsroad);
        expect(deck.slice(-2)).toContain(this.hedgeKnight);
        expect(deck.slice(-2)).toContain(this.theRoseroad);
    });
});
