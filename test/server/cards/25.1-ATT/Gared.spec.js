describe('Gared (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Gared (ATT)'] },
            player2: { plotDeck: ['Rains of Autumn'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Rains of Autumn');
        this.player1.triggerAbility(this.gared);
    });

    it("kneels each opponent's faction card when an Omen plot is revealed", function () {
        expect(this.player2Object.faction.kneeled).toBe(true);

        this.selectFirstPlayer(this.player1);
        expect(this.player1).isReadyToTakeAction();
    });
});
