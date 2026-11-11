describe('Ser Bryce Caron (JS)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Ser Bryce Caron (JS)', 'Tumblestone Knight', 'House Maester']
            }
        });
    });

    it('gives each Knight character you control +1 STR', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(3);
        expect(this.serBryceCaron.getStrength()).toBe(4);
        expect(this.houseMaester.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
