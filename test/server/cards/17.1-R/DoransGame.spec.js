describe("Doran's Game (R)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tywin Lannister (Core)'],
                hand: ["Doran's Game (R)"],
                usedPlots: [
                    'A Noble Cause',
                    'Sneak Attack',
                    'A Clash of Kings',
                    'Trading with the Pentoshi',
                    'Famine',
                    'Rationing'
                ]
            }
        });
        this.startingPower = this.player1Object.faction.power;
        this.unopposedChallenge(this.player1, 'Intrigue', this.tywinLannister);
        this.player1.triggerAbility("Doran's Game");
    });

    it('gains at most 5 power for your faction', function () {
        expect(this.player1Object.faction.power).toBe(this.startingPower + 1 + 5);
        expect(this.player1).isReadyToTakeAction();
    });
});
