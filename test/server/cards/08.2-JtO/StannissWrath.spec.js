describe("Stannis's Wrath", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'baratheon', hand: ["Stannis's Wrath"], gold: 1 },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickCard(this.stannissWrath);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels a character without a power icon', function () {
        expect(this.burnedMen.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
