describe('House Bannerman', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['House Bannerman'], hand: ['Tumblestone Knight'], gold: 1 }
        });
        this.player1.clickCard(this.houseBannerman);
    });

    it('kneels to reduce the cost of the next in-faction character you marshal this phase by 1', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.houseBannerman.kneeled).toBe(true);
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
