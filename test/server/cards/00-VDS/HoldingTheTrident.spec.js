describe('Holding the Trident', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Holding the Trident',
                inPlay: ['Tumblestone Knight']
            },
            player2: { inPlay: ['House Maester', 'Bastard in Hiding'] }
        });
    });

    it('gives each character you control +2 STR while you control fewer characters than each opponent', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(4);
        expect(this.houseMaester.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
