describe('Khorane Sathmantes', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'baratheon', inPlay: ['Khorane Sathmantes', 'Iron Fleet Scout'] },
            player2: { inPlay: ['Tumblestone Knight', 'Sweet Cersei'] }
        });
        this.player1.clickCard(this.khoraneSathmantes);
        this.player1.clickCard(this.ironFleetScout);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.sweetCersei);
    });

    it('kneels itself and a Warship location to kneel a character and a location', function () {
        expect(this.ironFleetScout.kneeled).toBe(true);
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.sweetCersei.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
