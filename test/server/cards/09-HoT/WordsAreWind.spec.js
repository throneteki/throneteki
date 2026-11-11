describe('Words Are Wind', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Words Are Wind'],
                drawDeck: ['Hedge Knight', 'Castle Guard'],
                discard: ['The Roseroad']
            },
            player2: { hand: ['Plunder'] }
        });
        this.player1.clickPrompt('Done');
        this.startingGold = this.player2Object.gold;
        this.player2.clickCard(this.plunder);
        this.player1.triggerAbility('Words Are Wind');
    });

    it('has the opponent choose to cancel their event', function () {
        this.player2.clickPrompt('Cancel Plunder');
        expect(this.player2Object.gold).toBe(this.startingGold);
    });

    it('has the opponent choose to have you draw 2 cards instead', function () {
        this.player2.clickPrompt('player1 draws 2 cards');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('hand');
    });
});
