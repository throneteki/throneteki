describe('Rakharo', function () {
    describe('after you win a military challenge with 2 attacking Dothraki', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Rakharo (DotE)', 'Braided Warrior'] },
                player2: { hand: ['Hot Pie (FFH)'] }
            });
            this.unopposedChallenge(this.player1, 'Military', [this.rakharo, this.braidedWarrior]);
            this.player1.triggerAbility(this.rakharo);
        });

        it("discards 1 card at random from the losing opponent's hand", function () {
            expect(this.hotPie.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
