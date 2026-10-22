describe('Robert Baratheon (LMHR)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Robert Baratheon (LMHR)'] } });
        this.unopposedChallenge(this.player1, 'Power', this.robertBaratheon);
        this.player1.triggerAbility(this.robertBaratheon);
    });

    it('gains 1 power for your faction after he gains power', function () {
        expect(this.robertBaratheon.power).toBe(1);
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
