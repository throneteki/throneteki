describe('The Shield Islands', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: ['The Shield Islands']
            }
        });

        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('increases the number of cards each player draws in the draw phase by 1', function () {
        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player2Object.hand).toHaveLength(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
