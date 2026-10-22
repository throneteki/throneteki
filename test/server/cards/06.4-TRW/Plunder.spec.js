describe('Plunder', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Plunder'] },
            player2: { discard: ['Little Bird (Core)', 'The Roseroad', 'Hedge Knight'] }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.plunder);
    });

    it("gains 1 gold for each location and attachment in the opponent's discard pile", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(this.startingGold + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
