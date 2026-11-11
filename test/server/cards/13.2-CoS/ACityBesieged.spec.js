describe('A City Besieged', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['A City Besieged'] },
            player2: { inPlay: ['The Kingsroad'] }
        });
        this.player1.selectPlot('A City Besieged');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.theKingsroad);
        this.player1.clickPrompt('Done');
    });

    it('kneels a location when revealed', function () {
        expect(this.theKingsroad.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
