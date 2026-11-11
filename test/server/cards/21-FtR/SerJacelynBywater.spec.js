describe('Ser Jacelyn Bywater', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Jacelyn Bywater'], discard: ['Burned Men'], gold: 10 }
        });
        this.player1.clickCard(this.burnedMen);
    });

    it('lets you ambush non-unique Lannister characters from your discard pile', function () {
        expect(this.burnedMen.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
