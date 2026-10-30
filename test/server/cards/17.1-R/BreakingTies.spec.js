describe('Breaking Ties', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { plot: 'Breaking Ties (R)', inPlay: ['Loreza Sand'] },
            player2: { inPlay: ['House Dayne Knight'] }
        });
        this.player1.clickMenu(this.breakingTies, 'Return character/location to hand');
        this.player1.clickCard(this.lorezaSand);
        this.player1.clickCard(this.houseDayneKnight);
    });

    it("shuffles a standing loyal character into your deck to return a non-loyal character to its owner's hand", function () {
        expect(this.lorezaSand.location).toBe('draw deck');
        expect(this.houseDayneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
