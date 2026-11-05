describe('Hunting Accident', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Tumblestone Knight', kneeling: true },
                    {
                        card: 'Bastard in Hiding',
                        kneeling: true,
                        attachments: [{ card: 'Hunting Accident', owner: 'player2' }]
                    }
                ]
            }
        });

        this.completeChallengesPhase();
    });

    it('stops the attached character standing', function () {
        expect(this.bastardInHiding.kneeled).toBe(true);
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
