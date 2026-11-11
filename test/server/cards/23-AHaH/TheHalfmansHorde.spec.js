describe("The Halfman's Horde", function () {
    describe('after winning a challenge with another unique attacking Clansman', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ["The Halfman's Horde", 'Timett Son of Timett'] },
                player2: { hand: ['Hot Pie (FFH)'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.theHalfmansHorde);
            this.player1.clickCard(this.timettSonOfTimett);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.triggerAbility(this.theHalfmansHorde);
        });

        it("discards 1 card at random from the losing opponent's hand for each other unique attacking Clansman", function () {
            expect(this.hotPie.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
