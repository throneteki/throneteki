describe('Horselord', function () {
    describe('while attacking with another Dothraki', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Horselord', 'Braided Warrior'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.horselord);
            this.player1.clickCard(this.braidedWarrior);
            this.player1.clickPrompt('Done');
        });

        it('gets +1 STR for each other attacking Dothraki', function () {
            expect(this.horselord.getStrength()).toBe(2);
        });
    });
});
