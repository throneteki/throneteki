describe('Dagmer Cleftjaw (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { plot: 'Famine', deadPile: ['Dagmer Cleftjaw (TSoW)'], gold: 10 }
        });
        this.player1.clickCard(this.dagmerCleftjaw);
    });

    it('can be marshaled into shadows from your dead pile while a Winter plot is revealed', function () {
        expect(this.dagmerCleftjaw.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
