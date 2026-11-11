describe('Kings of Summer', function () {
    function setup(context, ownPlot, opponentPlot) {
        context.setupTest({
            phase: 'marshal',
            player1: { agenda: 'Kings of Summer', plot: ownPlot },
            player2: { plot: opponentPlot }
        });
    }

    it("increases the reserve value on each player's revealed plot by 1", function () {
        setup(this, 'A Noble Cause', 'A Noble Cause');

        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player2Object.getReserve()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });

    it('increases the gold value on your revealed Summer plot by 1 while no Winter plot is revealed', function () {
        setup(this, 'A Song of Summer', 'A Noble Cause');

        expect(this.player1Object.getIncome()).toBe(6);
        expect(this.player2Object.getIncome()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not increase the gold value of a non-Summer plot', function () {
        setup(this, 'A Noble Cause', 'A Song of Summer');

        expect(this.player1Object.getIncome()).toBe(5);
        expect(this.player2Object.getIncome()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not increase the gold value while a Winter plot is revealed', function () {
        setup(this, 'A Song of Summer', 'The Winds of Winter');

        expect(this.player1Object.getIncome()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
