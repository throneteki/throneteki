describe('The Wars To Come (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                agenda: 'The Wars To Come (R)',
                plotDeck: ['Sneak Attack', 'Taxation', 'A Noble Cause', 'Snowed Under']
            },
            player2: {
                plotDeck: ['Sneak Attack', 'Taxation', 'A Noble Cause', 'Snowed Under']
            }
        });

        this.player1.selectPlot('Sneak Attack');
        this.player2.selectPlot('Sneak Attack');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.selectPlot('Taxation');
        this.player2.selectPlot('Taxation');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.selectPlot('A Noble Cause');
        this.player2.selectPlot('A Noble Cause');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.selectPlot('Snowed Under');
        this.player2.selectPlot('Snowed Under');
        this.selectFirstPlayer(this.player1);
    });

    it('gives your non-War plots prized 1 while there are 3 or more plots in your used pile', function () {
        expect(this.player1Object.activePlot.getPrizedValue()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
