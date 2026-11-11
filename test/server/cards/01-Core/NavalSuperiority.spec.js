describe('Naval Superiority', function () {
    function setup(context, opponentPlot) {
        context.setupTest({
            phase: 'marshal',
            player1: { plot: 'Naval Superiority' },
            player2: { plot: opponentPlot }
        });
    }

    it('treats the base gold value on a revealed Kingdom plot as 0', function () {
        setup(this, 'A Noble Cause');

        expect(this.player2Object.getIncome()).toBe(0);
        expect(this.player1Object.getIncome()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('treats the base gold value on a revealed Edict plot as 0', function () {
        setup(this, 'Confiscation');

        expect(this.player2Object.getIncome()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not affect other plots', function () {
        setup(this, 'Sneak Attack');

        expect(this.player2Object.getIncome()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
