describe('Turncloak', function () {
    describe('after the opponent wins a challenge the attached character participates in', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: [{ card: 'Hedge Knight', attachments: ['Turncloak'] }] },
                player2: { inPlay: ['Castle Guard'] }
            });
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.castleGuard);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.triggerAbility(this.turncloak);
        });

        it('lets the winner take control of the attached character', function () {
            expect(this.hedgeKnight).toBeControlledBy(this.player2);
        });
    });
});
