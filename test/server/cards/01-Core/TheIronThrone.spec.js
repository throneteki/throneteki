describe('The Iron Throne (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['The Iron Throne (Core)']
            }
        });
    });

    it('contributes 8 STR to your total for dominance', function () {
        expect(this.player1Object.getDominance()).toBe(8 + this.player1Object.gold);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gives +1 reserve', function () {
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
