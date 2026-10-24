describe('Alchemist Apprentice', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Alchemist Apprentice'] },
            player2: { inPlay: ['Sweet Cersei', 'Casterly Rock (Core)'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.alchemistApprentice);
    });

    it("kneels to return a non-limited location with printed cost 2 or lower to its owner's hand", function () {
        this.player1.clickCard(this.sweetCersei);

        expect(this.sweetCersei.location).toBe('hand');
        expect(this.alchemistApprentice.kneeled).toBe(true);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        expect(this.player1).isReadyToTakeAction();
    });
});
