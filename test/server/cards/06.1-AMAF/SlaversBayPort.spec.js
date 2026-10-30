describe("Slaver's Bay Port", function () {
    function setup(deadPile) {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ["Slaver's Bay Port"] },
            player2: { deadPile }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.slaversBayPort);
    }

    it('kneels to gain 1 gold', function () {
        setup.call(this, ['Hedge Knight']);
        expect(this.slaversBayPort.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gains 2 gold instead if an opponent has 4 or more characters in their dead pile', function () {
        setup.call(this, Array(4).fill('Hedge Knight'));
        expect(this.player1Object.gold).toBe(this.startingGold + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
