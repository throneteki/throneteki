describe('Sworn Brother', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Sworn Brother'],
                hand: ['The Kingsroad', 'Heart Tree Grove']
            }
        });
    });

    it('reduces the cost of the first location you marshal each round by 1', function () {
        this.player1.clickCard(this.theKingsroad);

        expect(this.theKingsroad.location).toBe('play area');
        expect(this.player1Object.gold).toBe(5);

        this.player1.clickCard(this.heartTreeGrove);

        expect(this.player1Object.gold).toBe(5 - this.heartTreeGrove.getPrintedCost());
        expect(this.player1).isReadyToTakeAction();
    });
});
