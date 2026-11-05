describe('Wily Smuggler', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Wily Smuggler'], hand: ['Hedge Knight'] }
        });
        this.player1.clickMenu(this.wilySmuggler, 'Place card on top of deck');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('places a card from hand on top of your deck, then draws 1 card at the end of the phase', function () {
        expect(this.player1Object.drawDeck[0]).toBe(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
