describe('Dale Seaworth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Dale Seaworth'], discard: ['Dragonstone Port', 'Sweet Cersei'] }
        });
        this.player1.clickCard(this.daleSeaworth);
        this.player1.triggerAbility(this.daleSeaworth);
    });

    it('returns a baratheon location from your discard pile to your hand after you marshal him', function () {
        expect(this.player1).not.toBeAbleToSelect(this.sweetCersei);

        this.player1.clickCard(this.dragonstonePort);

        expect(this.dragonstonePort.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
