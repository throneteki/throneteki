describe('Retribution', function () {
    describe('after a character you control is killed for military claim while you control fewer characters', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: ['Tumblestone Knight'], hand: ['Retribution'] },
                player2: { inPlay: ['Castle Guard', 'Hedge Knight'] }
            });
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.castleGuard);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.triggerAbility(this.retribution);
        });

        it('makes the attacking player choose and kill an attacking character', function () {
            expect(this.player2).toBeAbleToSelect(this.castleGuard);
            expect(this.player2).not.toBeAbleToSelect(this.hedgeKnight);
            this.player2.clickCard(this.castleGuard);
            expect(this.castleGuard.location).toBe('dead pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
