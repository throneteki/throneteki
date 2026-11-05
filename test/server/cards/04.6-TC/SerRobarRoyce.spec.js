describe('Ser Robar Royce (TC)', function () {
    function setup(context, plot) {
        context.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: [plot],
                inPlay: ['Ser Robar Royce (TC)']
            }
        });

        context.player1.selectPlot(plot);
        context.player2.selectPlot('Filler Plot');
        context.selectFirstPlayer(context.player1);
    }

    it('gains 1 power after a Summer plot is revealed', function () {
        setup(this, 'Sailing the Summer Sea');

        this.player1.triggerAbility(this.serRobarRoyce);

        expect(this.serRobarRoyce.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('kneels after a Winter plot is revealed', function () {
        setup(this, 'Snowed Under');

        expect(this.serRobarRoyce.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
