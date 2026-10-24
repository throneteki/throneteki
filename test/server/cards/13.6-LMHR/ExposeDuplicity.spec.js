describe('Expose Duplicity', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Expose Duplicity'], shadows: ['Hedge Knight'] },
            player2: { shadows: ['Castle Guard'] }
        });
        this.player1.selectPlot('Expose Duplicity');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('discards each card in shadows', function () {
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
