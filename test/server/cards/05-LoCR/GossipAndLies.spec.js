describe('Gossip and Lies', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Gossip and Lies',
                inPlay: ['House Maester']
            }
        });

        this.unopposedChallenge(this.player1, 'Intrigue', this.houseMaester);
    });

    it('stops each character you control kneeling when declared as an attacker in your first [intrigue] challenge', function () {
        expect(this.houseMaester.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
