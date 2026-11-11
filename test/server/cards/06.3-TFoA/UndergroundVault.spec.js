describe('Underground Vault', function () {
    function setup(plot) {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Underground Vault'] },
            player2: { plot }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.undergroundVault);
    }

    it('kneels to gain 1 gold', function () {
        setup.call(this, 'Wraiths in Their Midst');
        expect(this.undergroundVault.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player1).isReadyToTakeAction();
    });

    it("gains 2 gold instead if an opponent's revealed plot has 5 or more gold", function () {
        setup.call(this, 'Filler Plot');
        expect(this.player1Object.gold).toBe(this.startingGold + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
