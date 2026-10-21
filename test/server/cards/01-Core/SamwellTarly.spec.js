describe('Samwell Tarly (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Samwell Tarly (Core)']
            }
        });
    });

    it('gives +1 reserve', function () {
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player2Object.getReserve()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
