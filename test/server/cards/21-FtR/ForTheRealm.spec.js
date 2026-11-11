describe('For the Realm (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'For the Realm (FtR)',
                hand: ['Casterly Rock (Core)']
            }
        });
    });

    it('reduces the cost of the first Army or Stronghold card you marshal this round by 4', function () {
        this.player1.clickCard(this.casterlyRock);

        expect(this.casterlyRock.location).toBe('play area');
        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
