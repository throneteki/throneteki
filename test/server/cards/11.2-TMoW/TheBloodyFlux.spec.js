describe('The Bloody Flux', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: { plot: 'The Bloody Flux' }
        });
    });

    it('stops characters being saved', function () {
        expect(this.tumblestoneKnight.canBeSaved()).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
