describe('Exchange of Information', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Exchange of Information'],
                drawDeck: ['Hedge Knight', 'The Roseroad', "Widow's Wail", 'Consolidation of Power']
            }
        });
        this.player1.selectPlot('Exchange of Information');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.theRoseroad);
        this.player2.clickCard(this.widowsWail);
        this.player2.clickCard(this.consolidationOfPower);
    });

    it("reveals the top 10 cards of your deck and adds a card of each type of the opponent's choice to your hand", function () {
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.widowsWail.location).toBe('hand');
        expect(this.consolidationOfPower.location).toBe('hand');
    });
});
