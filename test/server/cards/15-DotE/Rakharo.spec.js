describe('Rakharo', function () {
    describe('after you win a military challenge with 2 attacking Dothraki', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Rakharo (DotE)', 'Braided Warrior'] },
                player2: { hand: ['Hot Pie (FFH)'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.rakharo);
            this.player1.clickCard(this.braidedWarrior);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.triggerAbility(this.rakharo);
        });

        it("discards 1 card at random from the losing opponent's hand", function () {
            expect(this.hotPie.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
