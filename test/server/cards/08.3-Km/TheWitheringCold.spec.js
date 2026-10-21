describe('The Withering Cold', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'The Withering Cold',
                inPlay: [{ card: 'Tumblestone Knight', kneeling: true }]
            }
        });

        this.completeChallengesPhase();
    });

    it('skips the standing phase this round', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.game.getPlainTextLog()).not.toContain('standing phase');
        expect(this.player1).isReadyToTakeAction();
    });
});
