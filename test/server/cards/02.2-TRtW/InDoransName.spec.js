describe("In Doran's Name", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ["In Doran's Name"],
                usedPlots: ['A Noble Cause', 'Sneak Attack']
            }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.inDoransName);
    });

    it('kneels your faction card to gain gold equal to the plots in your used pile', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(this.startingGold + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
