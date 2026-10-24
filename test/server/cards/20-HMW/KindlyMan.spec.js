describe('Kindly Man', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Kindly Man', kneeling: true }] },
            player2: { inPlay: [{ card: 'Hedge Knight', tokens: { poison: 1 } }] }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Kindly Man');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('places a non-gold, non-power token of your choice on a card in play', function () {
        this.player1.clickPrompt('Gain token');
        expect(this.player1).not.toHavePromptButton('gold');
        expect(this.player1).not.toHavePromptButton('power');
        this.player1.clickPrompt('ear');
        expect(this.hedgeKnight.tokens.ear).toBe(1);
    });

    it('discards a non-gold, non-power token from a card in play', function () {
        this.player1.clickPrompt('Lose token');
        expect(this.player1).not.toHavePromptButton('ear');
        this.player1.clickPrompt('poison');
        expect(this.hedgeKnight.hasToken('poison')).toBe(false);
    });
});
