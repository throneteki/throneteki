describe('Three-Finger Hobb (R)', function () {
    function setup(hand) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Three-Finger Hobb (R)'], hand }
        });
        this.player1.togglePromptedActionWindow('taxation', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.threeFingerHobb);
    }

    it('draws 1 card after you check reserve if your hand is smaller than your reserve', function () {
        setup.call(this, ['Hedge Knight', 'Hedge Knight']);
        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('draws 2 cards instead if your hand is at least 5 smaller than your reserve', function () {
        setup.call(this, ['Hedge Knight']);
        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
