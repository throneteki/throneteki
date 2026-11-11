describe('Martial Law', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player2: {
                inPlay: [
                    {
                        card: 'Casterly Rock (Core)',
                        kneeling: true,
                        attachments: [{ card: 'Martial Law', owner: 'player1' }]
                    }
                ]
            }
        });

        this.completeChallengesPhase();
    });

    it('stops the attached location standing unless its controller has won a [power] challenge this round', function () {
        expect(this.casterlyRock.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
