describe('Snow Castle', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Snow Castle', 'Tumblestone Knight', 'Winterfell Steward'] }
        });
        this.player1.clickCard(this.snowCastle);
    });

    it('kneels to give a stark character +1 STR for each stark character you control', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.snowCastle.kneeled).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
