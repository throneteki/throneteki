describe('Knights of the Hollow Hill', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Knights of the Hollow Hill',
                inPlay: ['Lannisport Moneylender']
            }
        });
    });

    it('gives +3 income, +2 initiative and +1 reserve, and stops your other cards providing a gold bonus', function () {
        expect(this.player1Object.getIncome()).toBe(8);
        expect(this.player1Object.getInitiative()).toBe(2);
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
