describe('Common Cause', function () {
    describe('when revealed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['Common Cause'],
                    inPlay: ['Tumblestone Knight', 'Castle Guard', 'Hedge Knight']
                }
            });
            this.player1.selectPlot('Common Cause');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('has claim equal to the number of different factions among characters you control', function () {
            expect(this.player1Object.getClaim()).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
