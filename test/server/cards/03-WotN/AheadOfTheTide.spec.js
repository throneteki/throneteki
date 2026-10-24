describe('Ahead of the Tide', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { hand: ['Ahead of the Tide'], drawDeck: Array(4).fill('Hedge Knight') }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.player1.triggerAbility('Ahead of the Tide');
    });

    it('gives your plot +3 initiative and draws 1 card when you win initiative', function () {
        expect(this.player1Object.activePlot.getInitiative()).toBe(3);
        this.selectFirstPlayer(this.player1);

        expect(this.player1Object.hand.length).toBe(1 + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
