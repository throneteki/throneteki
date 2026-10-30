describe('Alyce Graceford', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Alyce Graceford'] } });
        this.player1.clickCard(this.alyceGraceford);
        this.player1.clickCard(this.alyceGraceford);
    });

    it('kneels to give a The Seven character renown until the end of the phase', function () {
        expect(this.alyceGraceford.kneeled).toBe(true);
        expect(this.alyceGraceford.hasKeyword('renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
