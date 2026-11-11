describe('Longtable', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Longtable', 'Grand Maester Pycelle (Core)'],
                hand: ['Renly Baratheon (TtB)']
            }
        });
    });

    it('gives each Small Council character you control +1 STR', function () {
        expect(this.grandMaesterPycelle.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('reduces the cost of the first Small Council or Spy character you marshal each phase by 1', function () {
        this.player1.clickCard(this.renlyBaratheon);

        expect(this.renlyBaratheon.location).toBe('play area');
        expect(this.player1Object.gold).toBe(5 - (this.renlyBaratheon.getPrintedCost() - 1));
        expect(this.player1).isReadyToTakeAction();
    });
});
