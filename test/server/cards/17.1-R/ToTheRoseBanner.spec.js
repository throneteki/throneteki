describe('To the Rose Banner! (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['To the Rose Banner! (R)'], inPlay: ['Margaery Tyrell (Core)'] }
        });
        this.player1.clickCard(this.toTheRoseBanner);
        this.player1.clickCard(this.margaeryTyrell);
    });

    it('kneels your faction card to remove a tyrell character you control from the game until the next phase begins', function () {
        expect(this.margaeryTyrell.location).toBe('out of game');

        this.completeMarshalPhase();

        expect(this.margaeryTyrell.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
