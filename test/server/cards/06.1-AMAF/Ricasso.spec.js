describe('Ricasso', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Ricasso', gold: 2 }]
            }
        });
    });

    it('counts as X additional plots in your used pile, where X is his gold', function () {
        expect(this.player1Object.getNumberOfUsedPlots()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
