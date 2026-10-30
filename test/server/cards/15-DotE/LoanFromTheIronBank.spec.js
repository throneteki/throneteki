describe('Loan from the Iron Bank', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Loan from the Iron Bank', 'A Noble Cause']
            },
            player2: {
                plotDeck: ['A Noble Cause', 'Taxation']
            }
        });

        this.player1.selectPlot('Loan from the Iron Bank');
        this.player2.selectPlot('A Noble Cause');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.selectPlot('A Noble Cause');
        this.player2.selectPlot('Taxation');
        this.selectFirstPlayer(this.player1);
    });

    it('reduces the gold on your revealed plot by 1 while it is in your used pile', function () {
        expect(this.player1Object.getIncome()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
