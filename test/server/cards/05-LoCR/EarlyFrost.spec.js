describe('Early Frost', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Early Frost']
            }
        });

        this.player1.selectPlot('Early Frost');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('reduces the number of cards each player draws in the draw phase by 1', function () {
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player2Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
