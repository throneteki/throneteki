describe("Chataya's Brothel", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ["Chataya's Brothel", 'Lordsport Shipwright'], gold: 0 }
        });
        this.player1.clickCard(this.chatayasBrothel);
        this.player1.clickCard(this.lordsportShipwright);
    });

    it('kneels a character with an intrigue icon to gain 1 gold', function () {
        expect(this.lordsportShipwright.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
