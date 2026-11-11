describe('The Hollow Hill', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['The Hollow Hill'],
                drawDeck: ['Sansa Stark (WotN)', 'Tumblestone Knight']
            }
        });

        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.theHollowHill);
    });

    it('kneels to search the top 10 cards for a non-loyal character while you control no loyal characters', function () {
        expect(this.player1).not.toBeAbleToSelect(this.sansaStark);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('hand');

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });
});
