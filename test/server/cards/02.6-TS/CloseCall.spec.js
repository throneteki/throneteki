describe('Close Call', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Close Call'], deadPile: ['Hot Pie (FFH)'] }
        });
        this.player1.selectPlot('Close Call');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.hotPie);
    });

    it('moves a character from your dead pile to your discard pile, then draws 1 card if no Winter plot is revealed', function () {
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
