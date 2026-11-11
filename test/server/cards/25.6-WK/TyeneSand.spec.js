describe('Tyene Sand (WK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tyene Sand (WK)'] },
            player2: { power: 1, inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.tyeneSand);
    });

    it("moves 1 power from the winning opponent's faction card to a character you control after you lose dominance", function () {
        this.player1.clickCard(this.tyeneSand);

        expect(this.tyeneSand.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
