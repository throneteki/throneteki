describe('Summer Harvest', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Summer Harvest'] },
            player2: { plotDeck: ['A Noble Cause', "Varys's Riddle"] }
        });
        this.player1.selectPlot('Summer Harvest');
    });

    it("has an income 2 higher than the printed gold value on the opponent's plot", function () {
        this.player2.selectPlot('A Noble Cause');
        this.selectFirstPlayer(this.player1);

        expect(this.summerHarvest.getIncome()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });

    // Varys's Riddle resolves second and copies Summer Harvest, which then compares against the
    // Riddle's own printed gold value. See
    // http://www.cardgamedb.com/forums/index.php?/topic/32255-varys-riddle-vs-summer-harvest/?p=281948
    it("uses the second value when played against Varys's Riddle", function () {
        this.player2.selectPlot("Varys's Riddle");
        this.selectFirstPlayer(this.player1);
        this.selectPlotOrder(this.player1);

        expect(this.summerHarvest.getIncome()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
