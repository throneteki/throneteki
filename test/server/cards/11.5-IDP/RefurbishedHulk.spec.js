describe('Refurbished Hulk', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Refurbished Hulk']
            }
        });
    });

    it('gives +1 income and +1 initiative', function () {
        expect(this.player1Object.getIncome()).toBe(6);
        expect(this.player1Object.getInitiative()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
