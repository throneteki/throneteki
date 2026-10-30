describe('a card selection at its limit', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            gameOptions: { manualMode: true },
            player1: {
                faction: 'martell',
                gold: 1,
                hand: ['A Game of Cyvasse'],
                inPlay: ['House Dayne Knight', 'Silent Sisters']
            }
        });

        this.player1.clickCard(this.aGameOfCyvasse);
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.silentSisters);
        this.player1.clickCard(this.houseDayneKnight);
    });

    it('ignores a click on another eligible card instead of treating it as a card click', function () {
        expect(this.houseDayneKnight.kneeled).toBe(false);
        expect(this.game.getPlainTextLog()).not.toContain('kneels House Dayne Knight');
        expect(this.player1).toHavePrompt('Select challenge attackers (max 1)');
    });
});
