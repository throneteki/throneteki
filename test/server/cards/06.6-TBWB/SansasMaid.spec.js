describe("Sansa's Maid", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: "Sansa's Maid", gold: 1 }, 'Sansa Stark (WotN)']
            }
        });
    });

    it('gives each Lady character you control +1 STR for each of her gold', function () {
        expect(this.sansaStark.getStrength()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
