describe('The Tattered Prince (FH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: [{ card: 'The Tattered Prince (FH)', gold: 1 }],
                plotDeck: ['A Noble Cause', 'Taxation']
            }
        });

        this.player1.selectPlot('A Noble Cause');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.selectPlot('Taxation');
        this.player2.selectPlot('Filler Plot');
    });

    it('returns to shadows after a plot enters your used pile unless you discard 1 gold from him', function () {
        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Yes');

        expect(this.theTatteredPrince.location).toBe('play area');
        expect(this.theTatteredPrince.tokens.gold).toBeFalsy();

        expect(this.player1).isReadyToTakeAction();
    });
});
