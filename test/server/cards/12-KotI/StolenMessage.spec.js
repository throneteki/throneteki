describe('Stolen Message', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { plot: 'Stolen Message' },
            player2: { drawDeck: ['Hedge Knight'] }
        });
        this.player1.clickMenu(this.stolenMessage, 'Place top card on bottom');
    });

    it("pays 1 gold to place the top card of an opponent's deck on the bottom", function () {
        expect(this.player2Object.drawDeck.at(-1)).toBe(this.hedgeKnight);
        expect(this.player1).isReadyToTakeAction();
    });
});
