describe('Small Council Chamber', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Small Council Chamber', 'Littlefinger (Core)']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.littlefinger);
        this.player1.triggerAbility(this.smallCouncilChamber);
    });

    it('gains 1 power after you win an intrigue challenge', function () {
        expect(this.smallCouncilChamber.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
