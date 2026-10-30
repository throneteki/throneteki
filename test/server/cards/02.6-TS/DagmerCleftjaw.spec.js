describe('Dagmer Cleftjaw', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Dagmer Cleftjaw (TS)'] },
            player2: {
                inPlay: [
                    { card: 'The Haunted Forest', kneeling: true },
                    { card: 'Hedge Knight', kneeling: true }
                ]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.dagmerCleftjaw);
        this.player1.triggerAbility('Dagmer Cleftjaw');
        this.player1.clickCard(this.theHauntedForest);
    });

    it('takes control of a location instead of the normal claim when attacking alone', function () {
        expect(this.theHauntedForest).toBeControlledBy(this.player1);
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
