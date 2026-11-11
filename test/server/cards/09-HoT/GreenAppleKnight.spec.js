describe('Green-Apple Knight', function () {
    describe('with 2 other Knights', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Green-Apple Knight', 'Hedge Knight', 'Tumblestone Knight'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.greenAppleKnight);
            this.player1.clickPrompt('Done');
        });

        it('gets +1 STR for each other Knight and does not kneel when declared as an attacker', function () {
            expect(this.greenAppleKnight.getStrength()).toBe(
                this.greenAppleKnight.getPrintedStrength() + 2
            );
            expect(this.greenAppleKnight.kneeled).toBe(false);
        });
    });
});
