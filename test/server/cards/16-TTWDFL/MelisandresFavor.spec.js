describe("Melisandre's Favor", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player2: {
                inPlay: [
                    {
                        card: 'House Maester',
                        attachments: [{ card: "Melisandre's Favor", owner: 'player1' }]
                    }
                ]
            }
        });
    });

    it('takes control of the attached character, and is sacrificed when the dominance phase ends', function () {
        expect(this.houseMaester.controller).toBe(this.player1Object);

        this.completeChallengesPhase();

        expect(this.melisandresFavor.location).toBe('discard pile');
        expect(this.houseMaester.controller).toBe(this.player2Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
