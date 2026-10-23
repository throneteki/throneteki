describe('Mathis Rowan', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Mathis Rowan', 'Hedge Knight'] }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickMenu(this.mathisRowan, 'Give control of card');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('gives an opponent control of a card you control, then gains 2 gold', function () {
        expect(this.hedgeKnight.controller).toBe(this.player2Object);
        expect(this.player1Object.gold).toBe(this.startingGold + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
