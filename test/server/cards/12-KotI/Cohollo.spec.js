describe('Cohollo', function () {
    describe('during a challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Cohollo', 'Tumblestone Knight'], hand: ['Hot Pie (FFH)'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu(this.cohollo, 'Discard a card');
            this.player1.clickCard(this.hotPie);
        });

        it('kneels and discards a card from your hand to participate on your side', function () {
            expect(this.hotPie.location).toBe('discard pile');
            expect(this.cohollo.kneeled).toBe(true);
            expect(this.cohollo.isAttacking()).toBe(true);
        });
    });
});
