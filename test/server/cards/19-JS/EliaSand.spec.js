describe('Elia Sand', function () {
    describe('while attacking with another Sand Snake', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Elia Sand (JS)', 'Bastard Daughter'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.eliaSand);
            this.player1.clickCard(this.bastardDaughter);
            this.player1.clickPrompt('Done');
        });

        it('raises the claim value on your revealed plot card by 1', function () {
            expect(this.player1Object.getClaim()).toBe(2);
        });
    });
});
