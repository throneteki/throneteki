describe('Lay Siege', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Lay Siege'] },
            player2: { inPlay: ['Moat Cailin', 'The Roseroad'] }
        });
        this.player1.clickCard(this.laySiege);
    });

    it('kneels the chosen location', function () {
        this.player1.clickCard(this.theRoseroad);
        expect(this.theRoseroad.kneeled).toBe(true);
        expect(this.theRoseroad.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('then discards it if it is Contested', function () {
        this.player1.clickCard(this.moatCailin);
        expect(this.moatCailin.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
