describe('Trading with the Pentoshi', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Trading with the Pentoshi'] },
            player2: { plotDeck: ['A Song of Summer'] }
        });
        this.player2Gold = this.player2Object.gold;

        this.player1.selectPlot(this.tradingWithThePentoshi);
        this.player2.selectPlot(this.aSongOfSummer);
        this.selectFirstPlayer(this.player1);
    });

    it('gives each opponent 3 gold', function () {
        expect(this.player2Object.gold).toBe(this.player2Gold + 3);
        expect(this.game.getPlainTextLog()).toContain(
            'player1 uses Trading with the Pentoshi to have each opponent gain 3 gold'
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
