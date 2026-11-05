describe("King's Landing (BtB)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ["King's Landing (BtB)"],
                hand: ['The Iron Throne (Core)']
            }
        });

        this.player1.clickCard(this.theIronThrone);
        this.player1.triggerAbility(this.kingsLanding);
    });

    it("kneels a King's Landing location that enters play to draw 1 card, and kneels one to gain 1 gold", function () {
        expect(this.theIronThrone.kneeled).toBe(true);
        expect(this.player1Object.hand).toHaveLength(1);

        const gold = this.player1Object.gold;
        this.player1.clickCard(this.kingsLanding);
        this.player1.clickCard(this.kingsLanding);

        expect(this.kingsLanding.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(gold + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
