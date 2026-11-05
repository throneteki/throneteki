describe('A Toast to the King', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Doran Martell (SoD)'], hand: ['A Toast to the King'], gold: 5 },
            player2: { inPlay: ['Hedge Knight'], hand: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility('A Toast to the King');
    });

    it('has an opponent without a character with that icon satisfy its claim when the challenges phase ends', function () {
        this.player1.clickPrompt('Intrigue');
        expect(this.castleGuard.location).toBe('discard pile');
    });
});
