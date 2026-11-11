describe('The War of the Five Kings', function () {
    describe('with no rivals', function () {
        beforeEach(function () {
            this.setupTest({ phase: 'plot', player1: { plotDeck: ['The War of the Five Kings'] } });
            this.player1.selectPlot('The War of the Five Kings');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('raises its claim by 1 for each rival you have', function () {
            expect(this.player1Object.getClaim()).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
