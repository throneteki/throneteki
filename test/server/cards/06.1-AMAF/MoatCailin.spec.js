describe('Moat Cailin', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                plot: 'Frozen Expanse',
                inPlay: ['Moat Cailin']
            },
            player2: { plot: 'Sneak Attack' }
        });
    });

    it("reduces the initiative on each opponent's revealed plot by 3 and the reserve by 1 while there are more Winter than Summer plots", function () {
        expect(this.player2Object.getInitiative()).toBe(8);
        expect(this.player2Object.getReserve()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
