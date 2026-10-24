describe('Priest of the Drowned God (NMG)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Priest of the Drowned God (NMG)', 'Tumblestone Knight']
            }
        });
    });

    it('gives each Drowned God character you control +1 STR', function () {
        expect(this.priestOfTheDrownedGod.getStrength()).toBe(3);
        expect(this.tumblestoneKnight.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
