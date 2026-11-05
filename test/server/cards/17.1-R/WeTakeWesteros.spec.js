describe('We Take Westeros! (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'We Take Westeros! (R)', inPlay: ['Andrik the Unsmiling'] },
            player2: { discard: ['The Kingsroad'] }
        });
        this.player1.clickCard(this.weTakeWesteros);
        this.player1.clickCard(this.andrikTheUnsmiling);
        this.player1.clickCard(this.theKingsroad);
    });

    it('kneels a Raider to put a location with lower printed cost from a discard pile into play under your control', function () {
        expect(this.andrikTheUnsmiling.kneeled).toBe(true);
        expect(this.theKingsroad.location).toBe('play area');
        expect(this.theKingsroad.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
