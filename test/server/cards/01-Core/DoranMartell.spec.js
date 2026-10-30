describe('Doran Martell (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Doran Martell (Core)', 'Arianne Martell (Core)']
            }
        });
    });

    it('gives each other [martell] Lord and Lady character you control +1 STR for each plot in your used pile', function () {
        expect(this.arianneMartell.getStrength()).toBe(
            this.arianneMartell.cardData.strength + this.player1Object.getNumberOfUsedPlots()
        );
        expect(this.doranMartell.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
