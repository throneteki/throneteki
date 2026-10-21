describe('Forgotten By History', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Forgotten By History'] },
            player2: { power: 2, inPlay: ['Tumblestone Knight', 'Ser Jaime Lannister (Core)'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.forgottenByHistory);
    });

    it("kneels your faction card to shuffle a character with printed cost up to its controller's faction power into its owner's deck", function () {
        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('draw deck');
        expect(this.player1Object.faction.kneeled).toBe(true);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        expect(this.player1).isReadyToTakeAction();
    });
});
