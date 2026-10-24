describe('Pyromancers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Pyromancers'], power: 1 },
            player2: { inPlay: ['Sweet Cersei'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
    });

    it('kneels and discards 1 power from your faction card to discard a non-limited location during the dominance phase', function () {
        const power = this.player1Object.faction.power;

        this.player1.clickCard(this.pyromancers);
        this.player1.clickCard(this.sweetCersei);

        expect(this.pyromancers.kneeled).toBe(true);
        expect(this.player1Object.faction.power).toBe(power - 1);
        expect(this.sweetCersei.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
