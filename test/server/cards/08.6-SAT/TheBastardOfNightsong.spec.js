describe('The Bastard of Nightsong', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Bastard of Nightsong'] },
            player2: { power: 1 }
        });
        this.unopposedChallenge(this.player1, 'Power', this.theBastardOfNightsong);
        this.player1.triggerAbility(this.theBastardOfNightsong);
    });

    it("moves 1 power from the losing opponent's faction card to yours after you win a power challenge he participates in", function () {
        expect(this.player2Object.faction.power).toBe(0);
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
