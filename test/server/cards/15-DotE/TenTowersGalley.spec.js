describe('Ten Towers Galley', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'greyjoy', inPlay: ['Ten Towers Galley', "Brandon's Gift"] }
        });
    });

    it("reduces each opponent's reserve by 1 while standing, and lets a player kneel a location with printed cost 2 or higher to kneel it", function () {
        expect(this.player2Object.getReserve()).toBe(5);
        expect(this.player1Object.getReserve()).toBe(6);

        this.player1.clickCard(this.tenTowersGalley);
        this.player1.clickCard(this.brandonsGift);

        expect(this.tenTowersGalley.kneeled).toBe(true);
        expect(this.player2Object.getReserve()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
