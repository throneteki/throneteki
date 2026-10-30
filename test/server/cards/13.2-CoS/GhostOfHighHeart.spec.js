describe('Ghost of High Heart', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ghost of High Heart', 'Hedge Knight'] },
            player2: { hand: ['Castle Guard'], drawDeck: ['Winterfell Steward'] }
        });
        this.player1.clickMenu(this.ghostOfHighHeart, 'Look at hand');
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.castleGuard);
    });

    it("kneels to look at a player's hand and discard 1 card from it, then that player draws 1 card", function () {
        expect(this.ghostOfHighHeart.kneeled).toBe(true);
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.hedgeKnight.getStrength()).toBe(this.hedgeKnight.getPrintedStrength() + 1);
    });
});
