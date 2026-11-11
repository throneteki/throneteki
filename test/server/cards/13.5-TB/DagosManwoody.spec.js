describe('Dagos Manwoody', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Sneak Attack', 'Fortified Position', 'A Noble Cause', 'Taxation'],
                inPlay: ['Dagos Manwoody']
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
        this.player1.selectPlot('Fortified Position');
        this.player2.selectPlot('Taxation');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.selectPlot('A Noble Cause');
        this.player2.selectPlot('A Noble Cause');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.selectPlot('Taxation');
        this.player2.selectPlot('Snowed Under');
        this.selectFirstPlayer(this.player1);
    });

    it('gains renown and stealth while there are 5 or more different Traits among plots in your used pile', function () {
        expect(this.dagosManwoody.hasKeyword('Stealth')).toBe(true);
        expect(this.dagosManwoody.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
