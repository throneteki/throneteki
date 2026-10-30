describe('A Song of Summer', function () {
    function setup(context, opponentPlot) {
        context.setupTest({
            phase: 'marshal',
            player1: { plot: 'A Song of Summer', inPlay: ['Tumblestone Knight'] },
            player2: { plot: opponentPlot, inPlay: ['Bastard in Hiding'] }
        });
    }

    it('gives each character you control +1 STR while no Winter plot is revealed', function () {
        setup(this, 'A Noble Cause');

        expect(this.tumblestoneKnight.getStrength()).toBe(3);
        expect(this.bastardInHiding.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gives no STR while a Winter plot is revealed', function () {
        setup(this, 'The Winds of Winter');

        expect(this.tumblestoneKnight.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
