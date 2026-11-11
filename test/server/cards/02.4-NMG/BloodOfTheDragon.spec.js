describe('Blood of the Dragon', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Blood of the Dragon',
                inPlay: ['Drogon (Core)', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Steward at the Wall']
            }
        });
    });

    it('gives each non-Dragon character -1 STR and kills it if its STR is 0', function () {
        expect(this.drogon.getStrength()).toBe(4);
        expect(this.tumblestoneKnight.getStrength()).toBe(1);
        expect(this.stewardAtTheWall.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
