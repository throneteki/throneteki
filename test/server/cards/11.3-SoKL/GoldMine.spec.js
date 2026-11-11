describe('Gold Mine', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'lannister',
                inPlay: ['Gold Mine'],
                hand: ['Burned Men'],
                drawDeck: ['Hot Pie (FFH)']
            }
        });
        this.player1.clickCard(this.goldMine);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels and discards a card from your hand to draw 1 card', function () {
        expect(this.goldMine.kneeled).toBe(true);
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
