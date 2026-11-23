describe('Royal Entourage', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'baratheon', inPlay: ['Royal Entourage'] },
            player2: { inPlay: ['Littlefinger (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.littlefinger);
    });

    it('kneels itself after you lose an intrigue challenge', function () {
        expect(this.royalEntourage.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
