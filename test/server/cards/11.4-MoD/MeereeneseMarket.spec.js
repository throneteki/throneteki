describe('Meereenese Market', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Meereenese Market'], drawDeck: ['Castle Guard'] },
            player2: { discard: ['Hedge Knight'] }
        });
        this.player1.clickMenu(this.meereeneseMarket, 'Place card on bottom of deck');
        this.player1.clickCard(this.hedgeKnight);
    });

    it("places a card in a discard pile on the bottom of its owner's deck", function () {
        expect(this.meereeneseMarket.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.player2Object.drawDeck[this.player2Object.drawDeck.length - 1]).toBe(
            this.hedgeKnight
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
