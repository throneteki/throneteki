describe("Brother's Robes", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: [{ card: 'Alyce Graceford', attachments: ["Brother's Robes"] }] },
            player2: { inPlay: ['Sweet Cersei'] }
        });
        this.player1.clickCard(this.alyceGraceford);
        this.player1.triggerAbility(this.brothersRobes);
    });

    it('blanks a location or attachment until the end of the phase after the attached character kneels', function () {
        this.player1.clickCard(this.sweetCersei);
        this.player1.clickCard(this.alyceGraceford);

        expect(this.sweetCersei.isBlankExcludingTraits()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
