describe('The Highroad (AHaH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['The Highroad (AHaH)'],
                hand: ['Heart Tree Grove']
            }
        });
    });

    it('gives +1 income, and sacrifices to reduce the cost of the next non-character card by 2', function () {
        expect(this.player1Object.gold).toBe(6);

        this.player1.clickCard(this.theHighroad);
        this.player1.clickCard(this.heartTreeGrove);

        expect(this.theHighroad.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(
            6 - Math.max(0, this.heartTreeGrove.getPrintedCost() - 2)
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
