describe('Ser Rolly Duckfield (BtB)', function () {
    describe('when a Lord would be killed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    inPlay: ['Ser Rolly Duckfield (BtB)', 'Aegon Targaryen (R2)'],
                    hand: ['Hedge Knight']
                },
                player2: { inPlay: ['Castle Guard'] }
            });
            expect(this.aegonTargaryen.hasIcon('military')).toBe(true);
            this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
            this.player1.clickCard(this.aegonTargaryen);
            this.player1.triggerAbility(this.serRollyDuckfield);
            this.player1.clickCard(this.hedgeKnight);
        });

        it('gives Aegon a military icon, and discards a card from your hand to save the Lord', function () {
            expect(this.aegonTargaryen.location).toBe('play area');
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
