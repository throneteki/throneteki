describe('Calling the Banners', function () {
    describe('when revealed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck: ['Calling the Banners'] },
                player2: { inPlay: ['Hedge Knight', 'Castle Guard'] }
            });
            this.goldBefore = this.player1Object.gold;
            this.player1.selectPlot('Calling the Banners');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('gains 1 gold for each character the chosen opponent controls', function () {
            expect(this.player1Object.gold).toBe(this.player1Object.activePlot.getIncome() + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
