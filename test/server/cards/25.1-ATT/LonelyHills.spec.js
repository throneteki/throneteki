describe('Lonely Hills', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Lonely Hills', { card: 'Ricasso', gold: 2 }]
            }
        });
    });

    it('counts as 1 fewer plot in your used pile while it is standing', function () {
        expect(this.player1Object.getNumberOfUsedPlots()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
