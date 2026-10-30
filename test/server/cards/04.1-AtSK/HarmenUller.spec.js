describe('Harmen Uller', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Harmen Uller'],
                hand: ['Obara Sand (Core)']
            }
        });
    });

    it('gives each Sand Snake character in your hand ambush 1 less than its printed cost', function () {
        expect(this.obaraSand.isAmbush()).toBe(true);
        expect(this.obaraSand.getAmbushCost()).toBe(this.obaraSand.getPrintedCost() - 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
