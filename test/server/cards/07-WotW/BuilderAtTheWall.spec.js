describe('Builder at the Wall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Builder at the Wall'],
                hand: ["Brandon's Gift"],
                gold: 1
            }
        });
        this.player1.clickCard(this.builderAtTheWall);
    });

    it('kneels to reduce the cost of the next thenightswatch attachment or location you marshal this phase by 1', function () {
        this.player1.clickCard(this.brandonsGift);

        expect(this.builderAtTheWall.kneeled).toBe(true);
        expect(this.brandonsGift.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
