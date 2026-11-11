describe("Fishmonger's Square", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ["Fishmonger's Square"], drawDeck: ['Castle Guard'] },
            player2: { discard: Array(10).fill('Hedge Knight') }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.fishmongersSquare);
    });

    it("kneels to draw 1 card and gain 1 gold with 10 or more cards in an opponent's discard pile", function () {
        expect(this.fishmongersSquare.kneeled).toBe(true);
        expect(this.castleGuard.location).toBe('hand');
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
