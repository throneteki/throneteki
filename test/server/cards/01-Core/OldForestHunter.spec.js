describe('Old Forest Hunter', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Old Forest Hunter'], hand: ['Hot Pie (FFH)'] }
        });
    });

    it('discards a card from your hand to gain 1 gold', function () {
        const gold = this.player1Object.gold;
        this.player1.clickMenu(this.oldForestHunter, 'Discard a card to gain 1 gold');
        this.player1.clickCard(this.hotPie);

        expect(this.hotPie.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(gold + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
