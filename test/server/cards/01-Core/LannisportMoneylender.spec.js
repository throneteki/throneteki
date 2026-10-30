describe('Lannisport Moneylender', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Lannisport Moneylender']
            }
        });
    });

    it('gives +1 income', function () {
        expect(this.player1Object.getIncome()).toBe(6);
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
