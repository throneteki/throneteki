describe('Moon Boy', function () {
    describe('after you lose a challenge he participates in', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Moon Boy'], hand: ['Hot Pie (FFH)'] },
                player2: { inPlay: ['Castle Guard'] }
            });
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.moonBoy);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.castleGuard);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
        });

        it('discards 1 card at random from your hand', function () {
            expect(this.hotPie.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
