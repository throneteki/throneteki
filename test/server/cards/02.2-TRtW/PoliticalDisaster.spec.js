describe('Political Disaster', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Political Disaster'],
                inPlay: ['Casterly Rock (Core)', 'The Roseroad', 'Sunspear (Core)']
            },
            player2: { inPlay: ['The Kingsroad'] }
        });
        this.player1.selectPlot('Political Disaster');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.casterlyRock);
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
    });

    it('discards each location a player did not choose', function () {
        expect(this.casterlyRock.location).toBe('play area');
        expect(this.theRoseroad.location).toBe('play area');
        expect(this.sunspear.location).toBe('discard pile');
        expect(this.theKingsroad.location).toBe('discard pile');
    });
});
