describe('Erik Anvil-Breaker (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Erik Anvil-Breaker (BtB)', kneeling: true }]
            }
        });

        this.completeChallengesPhase();
    });

    it('cannot stand during the standing phase', function () {
        expect(this.erikAnvilBreaker.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
