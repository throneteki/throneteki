describe('City of Wealth', function () {
    describe('with a City plot in your used pile', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck: ['City of Wealth'], usedPlots: ['City of Wealth'] }
            });
            this.player1.selectPlot('City of Wealth');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('gets +1 gold, initiative and reserve for each City plot in your used pile', function () {
            expect(this.player1Object.activePlot.getIncome()).toBe(3);
            expect(this.player1Object.activePlot.getInitiative()).toBe(3);
            expect(this.player1Object.activePlot.getReserve()).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
