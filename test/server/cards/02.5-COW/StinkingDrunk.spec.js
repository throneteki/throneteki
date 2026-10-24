describe('Stinking Drunk', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'baratheon' },
            player2: {
                inPlay: [
                    {
                        card: 'Tumblestone Knight',
                        kneeling: true,
                        attachments: [{ card: 'Stinking Drunk', owner: 'player1' }]
                    }
                ]
            }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.stinkingDrunk);
    });

    it('sacrifices itself to kneel the attached character after it stands', function () {
        expect(this.stinkingDrunk.location).toBe('discard pile');
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
