describe('Ibbenese Whaler', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ibbenese Whaler']
            }
        });

        this.player1.togglePromptedActionWindow('taxation', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.ibbeneseWhaler);
    });

    it('kneels and returns to shadows to draw 2 cards while you have no cards in hand', function () {
        expect(this.ibbeneseWhaler.location).toBe('shadows');
        expect(this.player1Object.hand).toHaveLength(2);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });
});
