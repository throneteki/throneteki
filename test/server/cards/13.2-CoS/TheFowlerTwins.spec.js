describe('The Fowler Twins', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { actionWindows: { challengeBegin: true }, inPlay: ['The Fowler Twins'] },
            player2: { inPlay: ['Hedge Knight', 'Tumblestone Knight'] }
        });
        this.player2.clickPrompt('Military');
        this.player1.clickCard(this.theFowlerTwins);
        this.player1.clickCard(this.hedgeKnight);
    });

    it('makes the chosen character be declared in the next challenge if able', function () {
        this.player2.clickPrompt('Military');
        this.player1.clickPrompt('Pass');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');

        expect(this.hedgeKnight.isAttacking()).toBe(true);
    });
});
