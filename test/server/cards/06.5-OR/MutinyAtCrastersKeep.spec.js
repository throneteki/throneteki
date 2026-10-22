describe("Mutiny At Craster's Keep", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Old Forest Hunter'],
                hand: ["Mutiny At Craster's Keep"]
            },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.mutinyAtCrastersKeep);
        this.player1.clickCard(this.oldForestHunter);
        this.player1.clickCard(this.khalDrogo);
    });

    it('sacrifices your highest cost character to discard a character an opponent controls during dominance', function () {
        expect(this.oldForestHunter.location).toBe('discard pile');
        expect(this.khalDrogo.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
