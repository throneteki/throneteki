describe("Marsh's Conspirator (FUtG)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ["Marsh's Conspirator (FUtG)"], gold: 2 },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickCard(this.marshsConspirator);
        this.player1.triggerAbility(this.marshsConspirator);
    });

    it('blanks a character until the end of the phase after it comes out of shadows', function () {
        this.player1.clickCard(this.khalDrogo);

        expect(this.khalDrogo.isBlankExcludingTraits()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
