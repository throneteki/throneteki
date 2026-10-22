describe('Fiery Followers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'baratheon', inPlay: [{ card: 'Fiery Followers', kneeling: true }] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.fieryFollowers);
    });

    it('stands after the dominance phase begins', function () {
        expect(this.fieryFollowers.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
