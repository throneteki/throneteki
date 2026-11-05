describe('Summer Sea Port', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Summer Sea Port']
            }
        });
    });

    it('gives +1 income and +1 reserve', function () {
        expect(this.player1Object.getIncome()).toBe(6);
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
