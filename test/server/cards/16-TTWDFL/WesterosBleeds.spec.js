describe('Westeros Bleeds', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Westeros Bleeds'],
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['House Maester']
            }
        });

        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.westerosBleeds);
    });

    it('discards each character from play', function () {
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.houseMaester.location).toBe('discard pile');

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });
});
