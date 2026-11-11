describe('challenge keyword restrictions', function () {
    describe('when a character cannot target using assault', function () {
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

        it('is not offered assault targets', function () {
            expect(this.player1).not.toHavePrompt('Select assault target for Thenns');
            expect(this.theKingsroad.isBlankExcludingTraits()).toBe(false);
        });
    });
});
