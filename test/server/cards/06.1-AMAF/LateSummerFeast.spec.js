describe('Late Summer Feast', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'Late Summer Feast', inPlay: ['Tumblestone Knight'] },
            player2: { plot: 'A Noble Cause', inPlay: ['House Dayne Knight'] }
        });
        this.handSize = this.player2Object.hand.length;
    });

    describe('when you win a challenge', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        });

        it('lets the losing opponent choose to draw 1 card', function () {
            expect(this.player2).toHavePrompt('Draw 1 card from Late Summer Feast?');
            expect(this.player1).not.toHavePrompt('Draw 1 card from Late Summer Feast?');
        });

        it('draws them 1 card if they choose to', function () {
            this.player2.clickPrompt('Yes');

            expect(this.player2Object.hand).toHaveLength(this.handSize + 1);
            expect(this.game.getPlainTextLog()).toContain('player2 draws 1 card');
            expect(this.player1).isReadyToTakeAction();
        });

        it('draws them nothing if they decline', function () {
            this.player2.clickPrompt('No');

            expect(this.player2Object.hand).toHaveLength(this.handSize);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you lose a challenge', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Military', this.houseDayneKnight);
        });

        it('has no effect', function () {
            expect(this.player1).not.toHavePrompt('Draw 1 card from Late Summer Feast?');
            expect(this.player2).not.toHavePrompt('Draw 1 card from Late Summer Feast?');
        });
    });
});
