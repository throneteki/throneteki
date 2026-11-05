describe('Handmaiden', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Handmaiden', { card: 'Margaery Tyrell (Core)', kneeling: true }] }
        });
        this.player1.clickCard(this.handmaiden);
        this.player1.clickCard(this.margaeryTyrell);
    });

    it('sacrifices itself to stand a Lady character', function () {
        expect(this.handmaiden.location).toBe('discard pile');
        expect(this.margaeryTyrell.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
