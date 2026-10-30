describe("Doran's Game", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tywin Lannister (Core)'],
                hand: ["Doran's Game (Core)"],
                usedPlots: ['A Noble Cause', 'Sneak Attack']
            }
        });
        this.startingPower = this.player1Object.faction.power;
        this.unopposedChallenge(this.player1, 'Intrigue', this.tywinLannister);
        this.player1.triggerAbility("Doran's Game");
    });

    it('gains 1 power for your faction for each plot in your used pile', function () {
        expect(this.player1Object.faction.power).toBe(this.startingPower + 1 + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
