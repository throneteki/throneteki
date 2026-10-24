describe('A Gift of Arbor Red', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['A Gift of Arbor Red'], drawDeck: ['Hedge Knight', 'Castle Guard'] },
            player2: { drawDeck: ['The Roseroad', 'The Kingsroad'] }
        });
        this.player1.clickCard(this.aGiftOfArborRed);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickCard(this.theKingsroad);
    });

    it("kneels your faction card to add a revealed card from each player's top 4 to their hand", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.castleGuard.location).toBe('hand');
        expect(this.theKingsroad.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.theRoseroad.location).toBe('draw deck');
    });
});
