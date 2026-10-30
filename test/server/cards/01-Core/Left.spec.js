describe('Left', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Left', 'Right']
            }
        });
    });

    it('gets +1 STR and a [power] icon while you control Right', function () {
        expect(this.left.getStrength()).toBe(3);
        expect(this.left.hasIcon('power')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
