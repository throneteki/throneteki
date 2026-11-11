describe('Raiding Longship', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Raiding Longship', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.raidingLongship);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels to stop a defending character without attachments contributing STR while you are the first player', function () {
        expect(this.raidingLongship.kneeled).toBe(true);
        expect(this.game.currentChallenge.defenderStrength).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
