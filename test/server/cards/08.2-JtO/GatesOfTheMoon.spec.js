describe('Gates of the Moon', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { plot: 'A Noble Cause', inPlay: ['Gates of the Moon'] },
            player2: { plot: 'A Song of Summer' }
        });
        this.player1.clickPrompt('Done');
    });

    it('gives its controller +2 income', function () {
        expect(this.player1Object.gold).toBe(7);
    });

    it("increases the gold value on each opponent's revealed plot by 1", function () {
        expect(this.player2Object.gold).toBe(6);
        expect(this.player2).isReadyToTakeAction();
    });
});
