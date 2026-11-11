describe('A Southron Peace', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'plot', player1: { plotDeck: ['A Southron Peace'] } });
        this.player1.selectPlot('A Southron Peace');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();
    });

    it('stops you and the chosen opponent initiating military challenges against each other', function () {
        expect(this.player1).toHaveDisabledPromptButton('Military');

        expect(this.player1).isReadyToTakeAction();
    });
});
