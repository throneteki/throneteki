describe('Heads on Pikes', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Heads on Pikes'], gold: 2 },
            player2: {
                deadPile: ['Hedge Knight'],
                drawDeck: ['Castle Guard', 'Winterfell Steward', 'The Roseroad']
            }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.headsOnPikes);
    });

    it('has each opponent discard the top 2 cards of their deck for each character in their dead pile', function () {
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('draw deck');
    });
});
