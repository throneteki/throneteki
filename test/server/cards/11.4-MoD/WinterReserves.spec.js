describe('Winter Reserves', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Winter Reserves', 'Snowed Under']
            },
            player2: {
                plotDeck: ['A Noble Cause', 'Sneak Attack']
            }
        });

        this.player1.selectPlot('Winter Reserves');
        this.player2.selectPlot('A Noble Cause');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
        this.completeChallengesPhase();
        this.player1.selectPlot('Snowed Under');
        this.player2.selectPlot('Sneak Attack');
        this.selectFirstPlayer(this.player1);
    });

    it('increases the gold and reserve on your revealed Winter plot by 1 while it is in your used pile', function () {
        expect(this.player1Object.getIncome()).toBe(6);
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
