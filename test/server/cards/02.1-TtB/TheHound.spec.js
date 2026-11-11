describe('The Hound', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Hound (TtB)'], hand: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.theHound);
    });

    it('discards 1 card at random from your hand to stay in play', function () {
        this.player1.clickPrompt('Yes');
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.theHound.location).toBe('play area');
    });

    it('returns to your hand otherwise', function () {
        this.player1.clickPrompt('No');
        expect(this.theHound.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
