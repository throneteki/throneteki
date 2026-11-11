describe('To Go Forward You Must Go Back', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['To Go Forward You Must Go Back', 'Tumblestone Knight']
            },
            player2: {
                hand: ['House Maester']
            }
        });

        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.toGoForwardYouMustGoBack);
    });

    it('lets each player shuffle their hand into their deck and draw 5 cards', function () {
        this.player1.clickPrompt('Yes');
        this.player2.clickPrompt('No');

        expect(this.player1Object.hand).toHaveLength(5);
        expect(this.player2Object.hand).toHaveLength(1);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });
});
