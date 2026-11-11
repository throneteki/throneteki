describe('Chamber of the Painted Table', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Chamber of the Painted Table', 'Robb Stark (Core)'] },
            player2: { power: 2 }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Chamber of the Painted Table');
        this.player1.clickCard(this.player2Object.faction);
    });

    it("moves 1 power from an opponent's faction card to your own after you win dominance", function () {
        expect(this.player1Object.faction.power).toBe(1 + 1);
        expect(this.player2Object.faction.power).toBe(1);
    });
});
