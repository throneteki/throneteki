describe('an ability whose game action depends on each player choosing a target', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['The Stranger (HMW)'], inPlay: ['Robb Stark (Core)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.selectPlot('The Stranger');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it("does not rule out a player's choices before every player has chosen", function () {
        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.player2).toBeAbleToSelect(this.robbStark);
    });
});
