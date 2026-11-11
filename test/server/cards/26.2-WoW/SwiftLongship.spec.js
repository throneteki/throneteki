describe('Swift Longship', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { shadows: ['Swift Longship'], inPlay: ['Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.swiftLongship);
        this.player1.triggerAbility(this.swiftLongship);
        this.player1.clickCard(this.burnedMen);
    });

    it('stops a defending character with printed STR 4 or lower contributing STR after it comes out of shadows during a challenge', function () {
        expect(this.game.currentChallenge.defenderStrength).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
