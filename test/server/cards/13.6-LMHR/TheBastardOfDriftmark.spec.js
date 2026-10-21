describe('The Bastard of Driftmark (LMHR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'The Bastard of Driftmark (LMHR)',
                    { card: 'Casterly Rock (Core)', kneeling: true }
                ]
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.theBastardOfDriftmark);
        this.player1.triggerAbility(this.theBastardOfDriftmark);
    });

    it('stands a location after you win an intrigue challenge he participates in', function () {
        this.player1.clickCard(this.casterlyRock);

        expect(this.casterlyRock.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
