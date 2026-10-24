describe('Merchant Prince', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Merchant Prince', attachments: ['Little Bird (Core)'] }]
            }
        });
    });

    it('gets +1 STR and a [military] icon while it has an attachment', function () {
        expect(this.merchantPrince.getStrength()).toBe(4);
        expect(this.merchantPrince.hasIcon('military')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
