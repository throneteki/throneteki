describe('Brown Ben Plumm', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Brown Ben Plumm'], gold: 0 } });
        this.completeChallengesPhase();
    });

    it('is sacrificed when the challenges phase ends if you have no gold', function () {
        expect(this.brownBenPlumm.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
