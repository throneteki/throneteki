describe('choosing a plot', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot'
        });
        this.chosenPlot = this.player1.findCardByName('Filler Plot', 'plot deck');
        this.otherPlot = this.player2.findCardByName('Filler Plot', 'plot deck');
        this.player1.clickCard(this.chosenPlot);
    });

    it('marks the chosen plot for its owner and keeps it hidden from the opponent', function () {
        expect(this.chosenPlot.getSummary(this.player1.player).selected).toBe(true);
        expect(this.chosenPlot.getSummary(this.player2.player).selected).toBe(false);
        expect(this.otherPlot.getSummary(this.player1.player).selected).toBe(false);
        expect(this.otherPlot.getSummary(this.player2.player).selected).toBe(false);

        this.player1.clickPrompt('Done');
        this.player2.selectPlot(this.otherPlot);
        this.selectFirstPlayer(this.player1);

        expect(this.player1.activePlot).toBe(this.chosenPlot);
        expect(this.player1).isReadyToTakeAction();
    });
});
