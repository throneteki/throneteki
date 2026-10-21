describe('Alannys Greyjoy (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Alannys Greyjoy (Core)']
            }
        });
    });

    it("reduces the reserve on each opponent's revealed plot by 1 while you are the first player", function () {
        expect(this.player1Object.firstPlayer).toBe(true);
        expect(this.player2Object.getReserve()).toBe(5);
        expect(this.player1Object.getReserve()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
