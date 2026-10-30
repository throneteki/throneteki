describe('Fortified Position', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Fortified Position'
            },
            player2: {
                inPlay: ['Khal Drogo (Core)']
            }
        });
    });

    it("treats each character's printed text box as blank except for Traits", function () {
        expect(this.khalDrogo.hasKeyword('Renown')).toBe(false);
        expect(this.khalDrogo.hasTrait('Dothraki')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
