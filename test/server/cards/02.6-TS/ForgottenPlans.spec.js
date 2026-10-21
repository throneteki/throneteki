describe('Forgotten Plans', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Forgotten Plans',
                inPlay: ['Tumblestone Knight']
            },
            player2: { plot: 'A Noble Cause' }
        });
    });

    it('treats the text box of each revealed non-Scheme plot as blank while it is not the plot phase', function () {
        expect(this.player2Object.activePlot.isAnyBlank()).toBe(true);
        expect(this.player1Object.activePlot.isAnyBlank()).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
