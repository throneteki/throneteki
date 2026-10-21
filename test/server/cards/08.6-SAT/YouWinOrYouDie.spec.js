describe('You Win Or You Die', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['You Win Or You Die'] },
            player2: { plotDeck: ['A Song of Summer'] }
        });

        this.player1.selectPlot(this.youWinOrYouDie);
        this.player2.selectPlot(this.aSongOfSummer);
        this.selectFirstPlayer(this.player1);
    });

    it('draws 2 cards when revealed', function () {
        expect(this.player1Object.hand.length).toBe(this.player2Object.hand.length + 2);
        expect(this.game.getPlainTextLog()).toContain(
            'player1 uses You Win Or You Die and draws 2 cards'
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
