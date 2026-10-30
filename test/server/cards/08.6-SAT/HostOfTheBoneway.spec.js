describe('Host of the Boneway', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Host of the Boneway', { card: 'Ricasso', gold: 2 }]
            }
        });
    });

    it('gets +1 STR for each plot in your used pile', function () {
        expect(this.hostOfTheBoneway.getStrength()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
