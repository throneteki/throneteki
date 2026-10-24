describe('Huntress', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'tyrell', inPlay: ['Huntress', 'Margaery Tyrell (Core)'] }
        });
    });

    it('gives tyrell characters you control with printed cost 3 or lower +1 STR while standing, and kneels to give one +3 STR', function () {
        expect(this.margaeryTyrell.getStrength()).toBe(4);

        this.player1.clickCard(this.huntress);
        this.player1.clickCard(this.margaeryTyrell);

        expect(this.margaeryTyrell.getStrength()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
