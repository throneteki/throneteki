describe('Open Revolt (ATT)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { plot: 'Open Revolt (ATT)' } });
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.openRevolt);
    });

    it('gains 2 power for your faction when the challenges phase ends if you have not lost an intrigue challenge', function () {
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
