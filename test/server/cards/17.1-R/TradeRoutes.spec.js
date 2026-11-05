describe('Trade Routes (R)', function () {
    describe('when revealed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck: ['Trade Routes (R)'] },
                player2: { inPlay: ['Dragonstone Port', 'The Kingsroad'] }
            });
            this.player1.selectPlot('Trade Routes (R)');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('gains 1 gold for each location the chosen player controls', function () {
            expect(this.player1Object.gold).toBe(this.player1Object.activePlot.getIncome() + 2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
