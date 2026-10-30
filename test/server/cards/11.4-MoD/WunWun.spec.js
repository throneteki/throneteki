describe('Wun Wun', function () {
    describe('during a challenge with a participating Wildling', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Wun Wun', 'Wildling Horde'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.wildlingHorde);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu(
                this.wunWun,
                'Kneel Wun Wun to have him participate in the current challenge'
            );
        });

        it('kneels to participate on your side', function () {
            expect(this.wunWun.kneeled).toBe(true);
            expect(this.wunWun.isAttacking()).toBe(true);
        });
    });
});
