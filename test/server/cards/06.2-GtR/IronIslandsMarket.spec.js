describe('Iron Islands Market', function () {
    function setup(discard) {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Iron Islands Market'] },
            player2: { discard }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.ironIslandsMarket);
    }

    it('kneels to gain 1 gold', function () {
        setup.call(this, ['Hedge Knight']);
        expect(this.ironIslandsMarket.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gains 2 gold instead if an opponent has 8 or more cards in their discard pile', function () {
        setup.call(this, Array(8).fill('Hedge Knight'));
        expect(this.player1Object.gold).toBe(this.startingGold + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
