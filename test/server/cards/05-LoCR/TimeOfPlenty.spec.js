describe('Time of Plenty', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Time of Plenty'] },
            player2: { plotDeck: ['A Song of Summer'] }
        });
        this.player1Hand = this.player1Object.hand.length;
        this.player2Hand = this.player2Object.hand.length;

        this.player1.selectPlot(this.timeOfPlenty);
        this.player2.selectPlot(this.aSongOfSummer);
        this.selectFirstPlayer(this.player1);
    });

    it('increases the number of cards each player draws in the draw phase by 1', function () {
        expect(this.player1Object.hand).toHaveLength(this.player1Hand + 3);
        expect(this.player2Object.hand).toHaveLength(this.player2Hand + 3);
        expect(this.player1).isReadyToTakeAction();
    });
});
