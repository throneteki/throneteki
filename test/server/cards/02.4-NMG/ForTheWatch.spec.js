describe('For the Watch!', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                plot: 'For the Watch!'
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
    });

    it('stops you losing the first challenge initiated against you each phase', function () {
        expect(this.player1Object.faction.power).toBe(0);
        expect(this.game.getPlainTextLog()).not.toContain('player1 won');
        expect(this.player1).isReadyToTakeAction();
    });
});
