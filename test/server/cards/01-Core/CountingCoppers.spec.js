describe('Counting Coppers', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'plot', player1: { plotDeck: ['Counting Coppers'] } });
        this.player1.selectPlot('Counting Coppers');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('draws 3 cards when revealed', function () {
        expect(this.player1Object.hand).toHaveLength(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
