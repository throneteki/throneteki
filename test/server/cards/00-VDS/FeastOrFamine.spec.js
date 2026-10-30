describe('Feast or Famine (VDS)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'plot', player1: { plotDeck: ['Feast or Famine (VDS)'] } });
        this.player1.selectPlot('Feast or Famine (VDS)');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Yes');
    });

    it('raises its gold value by 5 and lowers its claim by 2 when revealed, if you choose to', function () {
        expect(this.player1Object.gold).toBe(7);
        expect(this.feastOrFamine.getClaim()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
