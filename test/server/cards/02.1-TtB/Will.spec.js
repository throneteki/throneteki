describe('Will', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Will'] },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Power', this.castleGuard);
        this.player1.clickCard(this.will);
    });

    it('sacrifices a Ranger character you control after you lose an unopposed challenge', function () {
        expect(this.will.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
