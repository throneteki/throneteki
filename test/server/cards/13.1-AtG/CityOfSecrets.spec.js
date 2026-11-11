describe('City of Secrets', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['City of Secrets'],
                drawDeck: ['Tumblestone Knight', 'Sweet Cersei']
            },
            player2: { drawDeck: ['Burned Men', 'The Roseroad'] }
        });
        this.player1.selectPlot('City of Secrets');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('has each player draw 2 cards, then each player without a City plot in their used pile discards 2 cards', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.sweetCersei);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickCard(this.theRoseroad);
        this.player2.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.sweetCersei.location).toBe('discard pile');
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
