describe('Ser Cletus Yronwood', function () {
    describe('with plots in your used pile', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    inPlay: ['Ser Cletus Yronwood'],
                    usedPlots: ['A Noble Cause', 'Trading with the Pentoshi']
                }
            });
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('raises the initiative on your revealed plot by 1 for each plot in your used pile', function () {
            expect(this.player1Object.activePlot.getInitiative()).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
