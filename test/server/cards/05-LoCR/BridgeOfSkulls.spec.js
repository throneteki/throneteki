describe('Bridge of Skulls', function () {
    describe('when the challenges phase ends', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Bridge of Skulls'] },
                player2: { hand: ['Hot Pie (FFH)'] }
            });
            this.player1.togglePromptedActionWindow('dominance', true);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.player1.triggerAbility(this.bridgeOfSkulls);
        });

        it('makes an opponent who did not initiate a military challenge against you discard 1 card at random', function () {
            expect(this.hotPie.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
