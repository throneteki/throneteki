describe('The Arbor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['The Arbor']
            }
        });
    });

    it('gives +3 income', function () {
        expect(this.player1Object.getIncome()).toBe(8);
        expect(this.player1).isReadyToTakeAction();
    });
});
