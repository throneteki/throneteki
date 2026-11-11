describe('Maester Aemon (WotW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                plot: 'Sneak Attack',
                inPlay: ['Maester Aemon (WotW)', 'The Seastone Chair']
            },
            player2: { inPlay: ['Steward at the Wall'] }
        });
        this.unopposedChallenge(this.player2, 'Intrigue', this.stewardAtTheWall);
        this.player2.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Maester Aemon');
    });

    it('offers the challenge types not initiated against you this phase when the challenges phase ends', function () {
        expect(this.player1).toHavePromptButton('Military');
        expect(this.player1).toHavePromptButton('Power');
        expect(this.player1).not.toHavePromptButton('Intrigue');
    });

    it('has the opponent satisfy the claim of the chosen type', function () {
        this.player1.clickPrompt('Military');
        expect(this.player2).toHavePrompt('Select 2 characters to fulfill military claim');
        this.player2.clickCard(this.stewardAtTheWall);
        this.player2.clickPrompt('Done');
        expect(this.stewardAtTheWall.location).toBe('dead pile');
    });

    it('does not trigger cards that react to claim being applied during a challenge', function () {
        this.player1.clickPrompt('Military');
        expect(this.player1).not.toAllowAbilityTrigger('The Seastone Chair');
    });
});
