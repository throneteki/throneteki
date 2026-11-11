describe('Lionstar', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', inPlay: ['Lionstar'], hand: ['Burned Men'] }
        });
        this.player1.clickCard(this.lionstar);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels to put a lannister character with printed cost 4 or lower into play from your hand, and discards it at the end of the phase', function () {
        expect(this.burnedMen.location).toBe('play area');

        this.completeMarshalPhase();

        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
