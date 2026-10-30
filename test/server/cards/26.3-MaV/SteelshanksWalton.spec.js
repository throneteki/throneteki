describe('Steelshanks Walton', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Steelshanks Walton', 'Jalabhar Xho'] },
            player2: { power: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.jalabharXho);
        this.player2.clickPrompt('Done');
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.steelshanksWalton);
    });

    it('takes control of a non-loyal character you own', function () {
        this.player1.clickCard(this.jalabharXho);

        expect(this.jalabharXho.controller).toBe(this.player1Object);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        expect(this.player1).isReadyToTakeAction();
    });
});
