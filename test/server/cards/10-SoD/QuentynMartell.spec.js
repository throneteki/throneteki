describe('Quentyn Martell (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'martell', inPlay: ['Quentyn Martell (SoD)'] }
        });
        this.completeMarshalPhase();
    });

    it('has renown, and kneels after the challenges phase begins while you have fewer than 3 used plots', function () {
        expect(this.quentynMartell.hasKeyword('renown')).toBe(true);
        expect(this.quentynMartell.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
