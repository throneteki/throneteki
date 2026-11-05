describe('Lyn Corbray', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Lyn Corbray (VDS)', 'Ser Jaime Lannister (Core)', 'House Dayne Knight']
            },
            player2: {
                inPlay: ['Khal Drogo (Core)']
            }
        });
    });

    it('gives each non-Army character you control with printed cost 6 or higher +2 STR', function () {
        expect(this.lynCorbray.getStrength()).toBe(5);
        expect(this.serJaimeLannister.getStrength()).toBe(7);
        expect(this.houseDayneKnight.getStrength()).toBe(2);
        expect(this.khalDrogo.getStrength()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
