describe('Winterfell Kennels', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Winterfell Kennels'], hand: ['Summer (Core)'] }
        });
        this.player1.clickCard(this.winterfellKennels);
        this.player1.clickCard(this.summer);
    });

    it('kneels to put a Direwolf into play from your hand, which gets +1 STR and goes to the bottom of your deck at the end of the phase', function () {
        expect(this.summer.location).toBe('play area');
        expect(this.summer.getStrength()).toBe(this.summer.getPrintedStrength() + 1);

        this.completeChallengesPhase();

        expect(this.summer.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
