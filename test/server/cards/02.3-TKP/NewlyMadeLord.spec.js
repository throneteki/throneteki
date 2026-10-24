describe('Newly-Made Lord', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'greyjoy', hand: ['Newly-Made Lord'], gold: 4 },
            player2: { inPlay: ['Sweet Cersei'] }
        });
        this.player1.clickCard(this.newlyMadeLord);
        this.player1.triggerAbility(this.newlyMadeLord);
        this.player1.clickCard(this.sweetCersei);
    });

    it('discards a non-limited location with printed cost 3 or lower after you marshal it', function () {
        expect(this.sweetCersei.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
