describe("King's Men", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ["King's Men"], gold: 4 },
            player2: { inPlay: [{ card: 'Khal Drogo (Core)', kneeling: true }] }
        });
        this.player1.clickCard(this.kingsMen);
        this.completeMarshalPhase();
        this.player1.triggerAbility(this.kingsMen);
        this.player1.clickCard(this.khalDrogo);
    });

    it('blanks a kneeling character until the end of the phase after a phase begins', function () {
        expect(this.khalDrogo.isBlankExcludingTraits()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
