describe('Wraiths in Their Midst', function () {
    function setup(context, opponentPlot) {
        context.setupTest({
            phase: 'marshal',
            player1: { plot: 'Wraiths in Their Midst' },
            player2: { plot: opponentPlot }
        });
    }

    it("reduces the reserve value on each opponent's revealed plot by 2", function () {
        setup(this, 'A Noble Cause');

        expect(this.player2Object.getReserve()).toBe(4);
        expect(this.player1Object.getReserve()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not reduce it below 2', function () {
        setup(this, 'Strained Reserves (MaV)');

        expect(this.player2Object.getReserve()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
