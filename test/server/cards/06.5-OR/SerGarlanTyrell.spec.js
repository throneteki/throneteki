describe('Ser Garlan Tyrell (OR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: [{ card: 'Ser Garlan Tyrell (OR)', gold: 1 }] }
        });
    });

    it('gets +1 STR for each gold on him, and discards 1 gold to give a tyrell character +2 STR until the end of the phase', function () {
        expect(this.serGarlanTyrell.getStrength()).toBe(4);

        this.player1.clickCard(this.serGarlanTyrell);
        this.player1.clickCard(this.serGarlanTyrell);

        expect(this.serGarlanTyrell.getStrength()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
