describe('Devoted Bloodrider', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Devoted Bloodrider', 'Tumblestone Knight']
            }
        });
    });

    it('gives each Bloodrider character you control +1 STR', function () {
        expect(this.devotedBloodrider.getStrength()).toBe(3);
        expect(this.tumblestoneKnight.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
