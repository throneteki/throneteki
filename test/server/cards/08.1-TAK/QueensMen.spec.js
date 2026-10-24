describe("Queen's Men", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ["Queen's Men"], inPlay: ['Hedge Knight'], gold: 10 },
            player2: { hand: ['The Roseroad', 'Castle Guard'] }
        });
        this.player1.clickCard(this.queensMen);
        this.player1.triggerAbility("Queen's Men");
        this.player1.clickPrompt('Done');
    });

    it("looks at an opponent's hand after you marshal it, then may kneel a non-Baratheon character to discard a non-character card", function () {
        expect(this.player1).not.toAllowSelect(this.castleGuard);
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.hedgeKnight.kneeled).toBe(true);
    });
});
