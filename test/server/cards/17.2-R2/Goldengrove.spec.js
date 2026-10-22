describe('Goldengrove (R2)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Goldengrove (R2)', { card: 'Garden Caretaker', kneeling: true }] }
        });
        this.player1.clickMenu(this.goldengrove, 'Stand and take control');
        this.player1.clickCard(this.goldengrove);
        this.player1.clickCard(this.gardenCaretaker);
    });

    it('kneels to stand and take control of a card you own with equal or lower printed cost', function () {
        expect(this.goldengrove.kneeled).toBe(true);
        expect(this.gardenCaretaker.kneeled).toBe(false);
        expect(this.gardenCaretaker.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
