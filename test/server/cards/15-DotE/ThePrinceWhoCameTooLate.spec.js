describe('The Prince Who Came Too Late', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'The Prince Who Came Too Late',
                drawDeck: ['Little Bird (Core)', 'Tumblestone Knight']
            }
        });

        this.player1.togglePromptedActionWindow('standing', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.thePrinceWhoCameTooLate);
    });

    it('searches your deck for a character and puts it into play during the standing phase', function () {
        expect(this.player1).not.toBeAbleToSelect(this.littleBird);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('play area');

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });
});
