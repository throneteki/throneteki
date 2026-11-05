describe('House Yronwood Knight', function () {
    describe('after you lose a challenge it participates in', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['House Yronwood Knight'] },
                player2: { inPlay: ['Castle Guard'], hand: ['Hot Pie (FFH)'] }
            });
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.houseYronwoodKnight);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.castleGuard);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.triggerAbility(this.houseYronwoodKnight);
        });

        it("discards 1 card at random from the winning opponent's hand", function () {
            expect(this.hotPie.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
