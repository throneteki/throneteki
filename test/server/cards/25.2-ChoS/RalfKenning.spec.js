describe('Ralf Kenning (ChoS)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                plot: 'Snowed Under',
                inPlay: ['Ralf Kenning (ChoS)']
            }
        });
    });

    it("reduces the income and reserve on each opponent's revealed plot by 1 while there is a Winter plot revealed", function () {
        expect(this.player2Object.getIncome()).toBe(4);
        expect(this.player2Object.getReserve()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
