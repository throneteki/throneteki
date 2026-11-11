describe('Ser Andrey Dalt', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Andrey Dalt']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)', 'Tumblestone Knight']
            }
        });

        this.completeChallengesPhase();
    });

    it('stops each opponent gaining power from winning dominance', function () {
        expect(this.game.getPlainTextLog()).toContain('player2 wins dominance');
        expect(this.player2Object.faction.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
