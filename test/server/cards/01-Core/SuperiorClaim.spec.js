describe('Superior Claim', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Superior Claim'], inPlay: ['Khal Drogo (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);
        this.player1.triggerAbility(this.superiorClaim);
    });

    it('gains 2 power for your faction after you win a power challenge by 5 or more STR', function () {
        expect(this.player1Object.faction.power).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
