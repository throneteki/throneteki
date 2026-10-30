describe('Squire (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Squire (FtR)'], hand: ['Tumblestone Knight'], gold: 1 }
        });
        this.player1.clickCard(this.squire);
    });

    it('kneels to reduce the cost of the next Army or Knight character you marshal this phase by 1', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.squire.kneeled).toBe(true);
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
