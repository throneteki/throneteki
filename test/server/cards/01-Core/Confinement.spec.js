describe('Confinement', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Confinement'], gold: 1 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.confinement);
    });

    it('makes a character with STR 4 or lower lose a military, an intrigue and a power icon until the end of the phase', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.hasIcon('military')).toBe(false);
        expect(this.tumblestoneKnight.hasIcon('power')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
