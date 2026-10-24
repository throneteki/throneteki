describe('Harlaw', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Harlaw']
            }
        });
    });

    it("reduces the reserve on each opponent's revealed plot by 1, and gives +1 reserve", function () {
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player2Object.getReserve()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
