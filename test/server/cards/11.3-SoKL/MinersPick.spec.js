describe("Miner's Pick", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ["Miner's Pick"],
                inPlay: ['Steward at the Wall', 'Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.minersPick);
    });

    it('can only be attached to a Builder or Steward character, which gets +1 STR, and gives +1 income', function () {
        expect(this.player1).toBeAbleToSelect(this.stewardAtTheWall);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.stewardAtTheWall);

        expect(this.stewardAtTheWall.getStrength()).toBe(2);
        expect(this.player1Object.getIncome()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
