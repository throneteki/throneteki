describe("Brandon's Gift", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                inPlay: ["Brandon's Gift"],
                hand: ['Halder (NMG)', 'Steward at the Wall'],
                gold: 3
            }
        });
        this.player1.clickCard(this.halder);
        this.player1.triggerAbility(this.brandonsGift);
    });

    it('reduces the cost of the next thenightswatch card you marshal this phase by 1 after you marshal a Builder', function () {
        this.player1.clickCard(this.stewardAtTheWall);

        expect(this.stewardAtTheWall.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
