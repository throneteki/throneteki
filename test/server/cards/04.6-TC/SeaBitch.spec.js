describe('Sea Bitch', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Sea Bitch'] },
            player2: { inPlay: ['Sweet Cersei'] }
        });
        this.player1.clickCard(this.seaBitch);
        this.player1.clickCard(this.sweetCersei);
    });

    it('sacrifices itself to take control of a non-limited location until the end of the phase', function () {
        expect(this.seaBitch.location).toBe('discard pile');
        expect(this.sweetCersei.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
