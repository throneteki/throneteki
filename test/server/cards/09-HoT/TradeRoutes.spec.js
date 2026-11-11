describe('Trade Routes (HoT)', function () {
    describe('when revealed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck: ['Trade Routes (HoT)'], inPlay: ['The Kingsroad'] },
                player2: { inPlay: ['Dragonstone Port'] }
            });
            this.player1.selectPlot('Trade Routes (HoT)');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('gains 1 gold for each location you and the chosen opponent control', function () {
            expect(this.player1Object.gold).toBe(this.player1Object.activePlot.getIncome() + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
