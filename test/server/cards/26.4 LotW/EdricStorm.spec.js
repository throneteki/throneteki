describe('Edric Storm (LotW)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Edric Storm (LotW)']
            }
        });
    });

    it('stops each player gaining more than 3 power each round', function () {
        expect(this.player1Object.maxPowerGain.getMax()).toBe(3);
        expect(this.player2Object.maxPowerGain.getMax()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
