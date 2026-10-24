describe('Lordsport Shipwright', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Lordsport Shipwright'] },
            player2: { inPlay: ['The Kingsroad'] }
        });
        this.player1.clickCard(this.lordsportShipwright);
        this.player1.clickCard(this.theKingsroad);
    });

    it('kneels to kneel a location with printed cost 2 or lower', function () {
        expect(this.lordsportShipwright.kneeled).toBe(true);
        expect(this.theKingsroad.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
