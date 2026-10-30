describe('False Spring', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['False Spring'] },
            player2: { hand: ['Hedge Knight', 'Castle Guard', 'The Roseroad', 'The Kingsroad'] }
        });
        this.player1.selectPlot('False Spring');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.castleGuard);
        this.player2.clickCard(this.theRoseroad);
        this.player2.clickPrompt('Done');
    });

    it('has each opponent reveal 3 cards from their hand, then lets you discard 1 of them', function () {
        expect(this.player1).not.toAllowSelect(this.theKingsroad);
        this.player1.clickCard(this.castleGuard);
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
