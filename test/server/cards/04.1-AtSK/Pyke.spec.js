describe('Pyke (AtSK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'greyjoy', inPlay: ['Pyke (AtSK)', 'Tumblestone Knight'] }
        });
        this.player1.clickCard(this.pyke);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to give a character stealth until the end of the phase', function () {
        expect(this.pyke.kneeled).toBe(true);
        expect(this.tumblestoneKnight.hasKeyword('stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
