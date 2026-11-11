describe('A Pit of Snakes', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['A Pit of Snakes'], inPlay: ['Tumblestone Knight'], gold: 2 },
            player2: { inPlay: ['Hot Pie (FFH)'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.aPitOfSnakes);
        this.player1.clickCard(this.hotPie);
    });

    it('poisons a character with no challenge icons', function () {
        expect(this.hotPie.location).toBe('play area');

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.completeChallengesPhase();

        expect(this.hotPie.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
