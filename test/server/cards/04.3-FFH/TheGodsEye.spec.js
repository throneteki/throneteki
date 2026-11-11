describe("The God's Eye", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ["The God's Eye"]
            }
        });
    });

    it('gives +1 income and +1 reserve, and cannot be discarded from play', function () {
        expect(this.player1Object.getIncome()).toBe(6);
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.theGodsEye.allowGameAction('discard')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
