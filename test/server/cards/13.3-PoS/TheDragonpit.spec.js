describe('The Dragonpit', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['The Dragonpit'],
                shadows: ['Ser Andrey Dalt']
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
    });

    it('gives each character whose controller has fewer cards in shadows than you -1 STR', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
