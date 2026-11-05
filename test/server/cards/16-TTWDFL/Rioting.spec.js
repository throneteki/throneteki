describe('Rioting', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Rioting',
                inPlay: [{ card: 'Tumblestone Knight', kneeling: true }, 'House Maester']
            }
        });

        this.completeChallengesPhase();
    });

    it('discards each kneeling character from play after the standing phase begins', function () {
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.houseMaester.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
