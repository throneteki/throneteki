describe('The Last Greenseer', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['The Last Greenseer'] },
            player2: { plotDeck: ["At Prince Doran's Behest", 'The Winds of Winter'] }
        });
        this.expectPlotStatsOf = (player, income, claim, reserve) => {
            expect(player.activePlot.getIncome()).toBe(income);
            expect(player.activePlot.getClaim()).toBe(claim);
            expect(player.activePlot.getReserve()).toBe(reserve);
        };
        this.player1.selectPlot('The Last Greenseer');
        this.player2.selectPlot("At Prince Doran's Behest");
        this.selectFirstPlayer(this.player1);
        this.selectPlotOrder(this.player1);
        this.player1.clickCard(this.player2Object.activePlot);
    });

    it('switches its base gold, claim and reserve with another revealed plot', function () {
        this.expectPlotStatsOf(this.player1Object, 0, 0, 0);
        this.expectPlotStatsOf(this.player2Object, 4, 1, 5);
    });

    it('stops switching them when either plot leaves play', function () {
        this.player2.clickCard('The Winds of Winter', 'plot deck');
        this.expectPlotStatsOf(this.player1Object, 4, 1, 5);
        this.expectPlotStatsOf(this.player2Object, 3, 2, 5);
    });
});
