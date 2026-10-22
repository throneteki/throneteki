describe('Show of Strength', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Show of Strength'], gold: 2 },
            player2: { inPlay: ['Tumblestone Knight', 'Khal Drogo (Core)'] }
        });
        this.player1.clickCard(this.showOfStrength);
    });

    it('blanks each character with STR 3 or lower until the end of the phase', function () {
        expect(this.tumblestoneKnight.isAnyBlank()).toBe(true);
        expect(this.khalDrogo.isAnyBlank()).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
