describe('Botley Crew', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'plot', player1: { inPlay: ['Botley Crew'] } });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.botleyCrew);
    });

    it("returns 1 gold from an opponent's gold pool to the treasury after they collect income", function () {
        expect(this.player2Object.gold).toBe(this.player2Object.activePlot.getIncome() - 1);
        expect(this.player2).isReadyToTakeAction();
    });
});
