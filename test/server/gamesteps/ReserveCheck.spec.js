describe('the reserve check', function () {
    function overReserve(context, gameOptions) {
        context.setupTest({
            phase: 'challenge',
            gameOptions,
            player1: {
                hand: Array(7).fill('Hedge Knight')
            }
        });

        context.completeChallengesPhase();
    }

    describe('when manual mode is off', function () {
        beforeEach(function () {
            overReserve(this);
        });

        it('cannot be skipped', function () {
            expect(this.player1).toHavePrompt(
                'Select 1 cards to discard down to reserve (top first)'
            );

            this.player1.clickPrompt('Done');

            expect(this.player1).toHavePrompt(
                'Select 1 cards to discard down to reserve (top first)'
            );
            expect(this.game.getPlainTextLog()).not.toContain('continues without meeting reserve');
        });

        it('discards the chosen cards', function () {
            const card = this.player1Object.hand[0];
            this.player1.clickCard(card);
            this.player1.clickPrompt('Done');

            expect(card.location).toBe('discard pile');
            expect(this.player1Object.hand).toHaveLength(6);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 discards Hedge Knight to meet reserve'
            );
        });
    });

    describe('when manual mode is on', function () {
        beforeEach(function () {
            overReserve(this, { manualMode: true });
        });

        it('can be skipped, with an alert', function () {
            this.player1.clickPrompt('Done');

            expect(this.player1Object.hand).toHaveLength(7);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 continues without meeting reserve'
            );
        });
    });
});
