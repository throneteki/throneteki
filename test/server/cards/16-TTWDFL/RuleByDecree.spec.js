describe('Rule By Decree', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Rule By Decree'] },
            player2: {
                hand: [
                    'Tumblestone Knight',
                    'Sweet Cersei',
                    'Burned Men',
                    'The Roseroad',
                    'The Kingsroad',
                    'Casterly Rock (Core)'
                ]
            }
        });
        this.player1.selectPlot('Rule By Decree');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('has each player with the most cards in hand discard down to 4', function () {
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickCard(this.sweetCersei);
        this.player2.clickCard(this.burnedMen);
        this.player2.clickCard(this.theRoseroad);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Done');

        expect(this.theKingsroad.location).toBe('discard pile');
        expect(this.casterlyRock.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
