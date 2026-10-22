describe('Old Forest Hunter', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Old Forest Hunter'], hand: ['Hot Pie (FFH)'], gold: 0 }
        });
        this.player1.clickCard(this.oldForestHunter);
        this.player1.clickCard(this.hotPie);
    });

    it('discards a card from your hand to gain 1 gold', function () {
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
