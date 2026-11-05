describe('Sentinel Stand (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Sentinel Stand (ATT)', 'Steward at the Wall', 'Tumblestone Knight']
            }
        });
    });

    it('gives each character you control with 1 or fewer challenge icons +2 STR while it is standing', function () {
        expect(this.stewardAtTheWall.getStrength()).toBe(3);
        expect(this.tumblestoneKnight.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
