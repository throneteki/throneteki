describe('Arbor Vineyard', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Arbor Vineyard'], gold: 0 } });
        this.player1.clickCard(this.arborVineyard);
    });

    it('kneels to gain 1 gold', function () {
        expect(this.arborVineyard.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
