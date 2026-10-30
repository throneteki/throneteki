describe("The Dragon's Tail", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ["The Dragon's Tail (AtSK)"],
                drawDeck: ['Hedge Knight', 'Castle Guard']
            },
            player2: { drawDeck: ['Tumblestone Knight', 'Ranging Party'] }
        });
        this.player1.clickCard(this.theDragonsTail);
    });

    it('has you and the chosen opponent each draw 2 cards', function () {
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('hand');
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.rangingParty.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
