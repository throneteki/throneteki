describe('Arbor Queen', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Arbor Queen', 'Margaery Tyrell (Core)', 'Tumblestone Knight'] }
        });
        this.player1.clickCard(this.arborQueen);
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to give a tyrell character and a non-tyrell character +2 STR until the end of the phase', function () {
        expect(this.margaeryTyrell.getStrength()).toBe(5);
        expect(this.tumblestoneKnight.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
