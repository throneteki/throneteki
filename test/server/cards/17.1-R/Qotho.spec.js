describe('Qotho (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Qotho (R)', 'Deadly Khalasar', 'Dragon Sight'],
                plot: 'Name Day Tourney'
            }
        });
        this.player1.clickCard(this.qotho);
        this.player1.clickCard(this.deadlyKhalasar);
        this.player1.clickCard(this.dragonSight);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it('discards 2 targaryen cards from your hand to put himself into play', function () {
        expect(this.qotho.location).toBe('play area');
        expect(this.deadlyKhalasar.location).toBe('discard pile');
        expect(this.dragonSight.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
