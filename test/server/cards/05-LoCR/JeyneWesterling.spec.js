describe('Jeyne Westerling', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Jeyne Westerling', { card: 'Bran Stark (Core)', kneeling: true }] }
        });
        this.player1.clickCard(this.jeyneWesterling);
        this.player1.clickCard(this.branStark);
    });

    it('kneels to stand a stark King or Lord character', function () {
        expect(this.jeyneWesterling.kneeled).toBe(true);
        expect(this.branStark.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
