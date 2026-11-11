describe("King Robb's Host", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["King Robb's Host"] },
            player2: { power: 2 }
        });
        this.unopposedChallenge(this.player1, 'Military', this.kingRobbsHost);
        this.player1.triggerAbility(this.kingRobbsHost);
        this.player1.clickCard(this.kingRobbsHost);
    });

    it("moves 1 power from the losing opponent's faction card to an attacking character after you win a military challenge", function () {
        expect(this.kingRobbsHost.power).toBe(1);
        expect(this.player2Object.faction.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
