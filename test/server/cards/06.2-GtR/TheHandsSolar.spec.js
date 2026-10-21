describe("The Hand's Solar", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ["The Hand's Solar", 'Tumblestone Knight'] }
        });
        this.player1.clickCard(this.theHandsSolar);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to give a character an intrigue icon until the end of the phase', function () {
        expect(this.theHandsSolar.kneeled).toBe(true);
        expect(this.tumblestoneKnight.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
