describe('Right', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Left', 'Right']
            }
        });
    });

    it('gets +1 STR and an [intrigue] icon while you control Left', function () {
        expect(this.right.getStrength()).toBe(3);
        expect(this.right.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
