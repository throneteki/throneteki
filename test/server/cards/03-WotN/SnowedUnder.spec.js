describe('Snowed Under', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Snowed Under'
            },
            player2: {
                plot: 'Sneak Attack'
            }
        });
    });

    it('treats the base initiative on each revealed plot as 0', function () {
        expect(this.player1Object.getInitiative()).toBe(0);
        expect(this.player2Object.getInitiative()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
