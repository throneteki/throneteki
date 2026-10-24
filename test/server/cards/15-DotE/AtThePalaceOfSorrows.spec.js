describe('At the Palace of Sorrows (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Ser Jaime Lannister (Core)', 'Steward at the Wall']
            },
            player2: { plot: 'At the Palace of Sorrows (DotE)' }
        });
    });

    it("sets each character's STR to 3", function () {
        expect(this.serJaimeLannister.getStrength()).toBe(3);
        expect(this.stewardAtTheWall.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
