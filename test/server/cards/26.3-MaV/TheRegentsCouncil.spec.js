describe("The Regent's Council", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Grand Maester Pycelle (Core)', 'Tumblestone Knight'],
                hand: ["The Regent's Council"]
            }
        });
        this.startingPower = this.player1Object.faction.power;
        this.unopposedChallenge(this.player1, 'Intrigue', this.grandMaesterPycelle);
        this.player1.triggerAbility("The Regent's Council");
    });

    it('determines dominance after you win an intrigue challenge with a participating Small Council character', function () {
        expect(this.player1Object.faction.power).toBe(this.startingPower + 1 + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
