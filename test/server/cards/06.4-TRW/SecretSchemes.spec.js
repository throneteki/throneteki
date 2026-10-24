describe('Secret Schemes (TRW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Secret Schemes (TRW)'],
                usedPlots: ['A Noble Cause', 'Sneak Attack']
            }
        });
        this.handSize = this.player1Object.hand.length;
        this.player1.clickCard(this.secretSchemes);
    });

    it('kneels your faction card to draw a card for each plot in your used pile', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1Object.hand.length).toBe(this.handSize - 1 + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
