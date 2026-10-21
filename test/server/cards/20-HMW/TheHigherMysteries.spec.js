describe('The Higher Mysteries', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['The Higher Mysteries'],
                inPlay: ['House Maester'],
                drawDeck: ['Tumblestone Knight']
            }
        });

        this.unopposedChallenge(this.player1, 'Intrigue', this.houseMaester);
        this.player1.triggerAbility(this.theHigherMysteries);
    });

    it('puts the top card of your deck into play after you win a challenge with a participating Maester', function () {
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
