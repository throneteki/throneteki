describe('The Roseroad', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { plot: 'A Noble Cause', inPlay: ['The Roseroad'] },
            player2: { plot: 'A Noble Cause (Core)' }
        });
    });

    it('gives its controller +1 income', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
