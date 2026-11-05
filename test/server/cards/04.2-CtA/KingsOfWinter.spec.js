describe('Kings of Winter', function () {
    function setup(context, ownPlot, opponentPlot) {
        context.setupTest({
            phase: 'marshal',
            player1: { agenda: 'Kings of Winter', plot: ownPlot },
            player2: { plot: opponentPlot }
        });
    }

    it("reduces the reserve value on each player's revealed plot by 1", function () {
        setup(this, 'A Noble Cause', 'A Noble Cause');

        expect(this.player1Object.getReserve()).toBe(5);
        expect(this.player2Object.getReserve()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it("reduces the gold value on each opponent's non-Summer plot by 1 while you have a Winter plot revealed", function () {
        setup(this, 'The Winds of Winter', 'A Noble Cause');

        expect(this.player2Object.getIncome()).toBe(4);
        expect(this.player1Object.getIncome()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it("does not reduce the gold value of an opponent's Summer plot", function () {
        setup(this, 'The Winds of Winter', 'A Song of Summer');

        expect(this.player2Object.getIncome()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not reduce gold values while you have no Winter plot revealed', function () {
        setup(this, 'A Noble Cause', 'A Noble Cause');

        expect(this.player2Object.getIncome()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
