describe('Janos Slynt (AtSK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', inPlay: ['Janos Slynt (AtSK)'], gold: 1 }
        });
        this.player1.clickCard(this.janosSlynt);
    });

    it('pays 1 gold to get +2 STR until the end of the phase', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.janosSlynt.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
