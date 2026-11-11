describe('Knights of the Sun', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['A Noble Cause', 'Taxation', 'Snowed Under', 'Sneak Attack'],
                inPlay: ['Knights of the Sun']
            },
            player2: {
                plotDeck: ['A Noble Cause', 'Taxation', 'Snowed Under', 'Sneak Attack']
            }
        });
    });

    it('gains renown while there are 3 or more plots in your used pile', function () {
        for (const plot of ['A Noble Cause', 'Taxation', 'Snowed Under']) {
            expect(this.knightsOfTheSun.hasKeyword('Renown')).toBe(false);

            this.player1.selectPlot(plot);
            this.player2.selectPlot(plot);
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
            this.completeChallengesPhase();
        }

        this.player1.selectPlot('Sneak Attack');
        this.player2.selectPlot('Sneak Attack');
        this.selectFirstPlayer(this.player1);

        expect(this.player1Object.getNumberOfUsedPlots()).toBe(3);
        expect(this.knightsOfTheSun.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
