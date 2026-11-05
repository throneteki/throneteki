describe('Brazen Beast', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { discard: ['Brazen Beast'], gold: 3 } });
        this.player1.clickCard(this.brazenBeast);
    });

    it('pays 3 gold to put itself into shadows from your discard pile', function () {
        expect(this.brazenBeast.location).toBe('shadows');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
