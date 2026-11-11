describe('The Gathering Storm', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['The Gathering Storm'] },
            player2: { plotDeck: ['A Noble Cause', 'Trading with the Pentoshi'] }
        });
        this.player1.selectPlot('The Gathering Storm');
        this.player2.selectPlot('A Noble Cause');
        this.selectFirstPlayer(this.player1);
    });

    it('lets each opponent return their revealed plot to their plot deck and reveal a new one', function () {
        this.player2.clickCard(this.tradingWithThePentoshi);
        expect(this.aNobleCause.location).toBe('plot deck');
        expect(this.player2Object.activePlot).toBe(this.tradingWithThePentoshi);
        expect(this.player2Object.plotDiscard).not.toContain(this.aNobleCause);
    });

    it('lets them keep their revealed plot', function () {
        this.player2.clickPrompt('Done');
        expect(this.player2Object.activePlot).toBe(this.aNobleCause);
    });
});
