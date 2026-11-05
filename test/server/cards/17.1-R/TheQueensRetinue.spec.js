describe("The Queen's Retinue (R)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ["The Queen's Retinue (R)"] },
            player2: { drawDeck: ['Hedge Knight', 'Castle Guard'] }
        });
        this.player1.clickCard(this.theQueensRetinue);
        this.player1.clickPrompt('Put into play');
        this.player2.clickPrompt('Yes');
    });

    it('puts itself into play from shadows, then each opponent may draw 2 cards', function () {
        expect(this.theQueensRetinue.location).toBe('play area');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('hand');
    });
});
