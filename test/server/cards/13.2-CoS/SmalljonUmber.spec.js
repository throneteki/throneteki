describe('Smalljon Umber', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Smalljon Umber', { card: 'Ricasso', gold: 2 }]
            }
        });
    });

    it('gets -1 STR for each plot in your used pile', function () {
        expect(this.smalljonUmber.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
