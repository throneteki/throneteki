describe("Corsair's Dirk", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Lordsport Shipwright', attachments: ["Corsair's Dirk"] }],
                gold: 0
            },
            player2: { gold: 1 }
        });
        expect(this.lordsportShipwright.getStrength()).toBe(3);
        this.unopposedChallenge(this.player1, 'Intrigue', this.lordsportShipwright);
        this.player1.triggerAbility(this.corsairsDirk);
    });

    it("gives the attached character +2 STR, and moves 1 gold from the defending player's gold pool to yours after it wins attacking", function () {
        expect(this.player1Object.gold).toBe(1);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
