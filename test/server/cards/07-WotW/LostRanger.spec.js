describe('Lost Ranger', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Lost Ranger'] } });
        this.completeChallengesPhase();
    });

    it('is sacrificed when the challenges phase ends if you control no other Ranger', function () {
        expect(this.lostRanger.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
