describe('Poor Fellows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Poor Fellows'], drawDeck: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.poorFellows);
        this.player1.triggerAbility('Poor Fellows');
    });

    it('has the loser choose for you to draw 1 card', function () {
        this.player2.clickPrompt('Draws card');
        expect(this.hedgeKnight.location).toBe('hand');
    });

    it('has the loser choose for Poor Fellows to gain 1 power', function () {
        this.player2.clickPrompt('Gains power');
        expect(this.poorFellows.power).toBe(1);
    });
});
