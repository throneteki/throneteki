describe('Old Steward (JS)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Old Steward (JS)']
            }
        });
    });

    it('gives +1 reserve', function () {
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
