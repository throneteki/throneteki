describe('Treaty', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'Treaty', drawDeck: ['Hedge Knight'], hand: ['Castle Guard'] }
        });
        this.player1.clickMenu(this.treaty, 'Draw card then discard card');
        this.player1.clickCard(this.castleGuard);
    });

    it('kneels your faction card to draw 1 card, then discard 1 card from your hand', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('discard pile');
    });
});
