describe('Thenns', function () {
    describe('when every attacker is an Army or Wildling', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Thenns (FtR)'] },
                player2: { inPlay: ['The Kingsroad'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.thenns);
            this.player1.clickPrompt('Done');
        });

        it('can target a location using assault', function () {
            expect(this.player1).toBeAbleToSelect(this.theKingsroad);
        });
    });

    describe('when another attacker is not an Army or Wildling', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Thenns (FtR)', 'Tumblestone Knight'] },
                player2: { inPlay: ['The Kingsroad'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.thenns);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
        });

        it('cannot target a location using assault', function () {
            expect(this.player1).not.toHavePrompt('Select assault target for Thenns');
        });
    });
});
