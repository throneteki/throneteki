describe('House Manderly Knight', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                plot: 'Snowed Under',
                inPlay: ['House Manderly Knight']
            }
        });
    });

    it('gets +2 STR while there is a Winter plot revealed', function () {
        expect(this.houseManderlyKnight.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
