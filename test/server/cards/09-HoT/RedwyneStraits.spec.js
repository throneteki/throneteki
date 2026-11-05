describe('Redwyne Straits', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Redwyne Straits']
            }
        });
    });

    it('gives +2 income', function () {
        expect(this.player1Object.getIncome()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
