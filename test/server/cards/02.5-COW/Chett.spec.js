describe('Chett', function () {
    describe('during the dominance phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Chett', 'Steward at the Wall'], discard: ['Grey Wind (Core)'] }
            });
            this.player1.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
            this.player1.clickMenu(this.chett, 'Return a card to hand');
            this.player1.clickCard(this.stewardAtTheWall);
            this.player1.clickCard(this.greyWind);
        });

        it('kneels a Steward to return a Direwolf card from your discard pile to your hand', function () {
            expect(this.stewardAtTheWall.kneeled).toBe(true);
            expect(this.greyWind.location).toBe('hand');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
