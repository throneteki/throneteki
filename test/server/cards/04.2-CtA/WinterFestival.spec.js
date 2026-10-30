describe('Winter Festival', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { plot: 'Winter Festival' } });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.winterFestival);
    });

    it('gains 2 power for your faction when the challenges phase ends if no Summer plot is revealed', function () {
        expect(this.player1Object.faction.power).toBeGreaterThanOrEqual(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
