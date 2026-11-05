describe('Three-Finger Hobb (IDP)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Three-Finger Hobb (IDP)'] } });
        this.player1.togglePromptedActionWindow('taxation', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.threeFingerHobb);
    });

    it('draws 2 cards after you check reserve if your hand is smaller than your reserve', function () {
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
