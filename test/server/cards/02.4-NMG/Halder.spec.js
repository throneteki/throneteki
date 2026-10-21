describe('Halder (NMG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'thenightswatch', inPlay: ['Halder (NMG)', "Brandon's Gift"] }
        });
        this.player1.clickCard(this.halder);
        this.player1.clickCard(this.brandonsGift);
        this.player1.clickCard(this.halder);
    });

    it('kneels a thenightswatch location or attachment to give a thenightswatch character +1 STR until the end of the phase', function () {
        expect(this.brandonsGift.kneeled).toBe(true);
        expect(this.halder.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
