describe('The Watcher on the Walls', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                inPlay: ['Ranging Party', 'Old Forest Hunter'],
                hand: ['The Watcher on the Walls']
            },
            player2: { inPlay: ['Hedge Knight', 'Tumblestone Knight'] }
        });
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Pass');
        this.player1.clickCard(this.theWatcherOnTheWalls);
        this.player1.clickCard(this.rangingParty);
        this.player1.clickCard(this.oldForestHunter);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
    });

    it('kneels 2 Rangers to kill each attacking character', function () {
        expect(this.rangingParty.kneeled).toBe(true);
        expect(this.oldForestHunter.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('dead pile');
    });
});
