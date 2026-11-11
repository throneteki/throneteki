describe('Frozen Expanse', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Frozen Expanse',
                inPlay: [
                    { card: 'Tumblestone Knight', kneeling: true },
                    { card: 'Ser Jaime Lannister (Core)', kneeling: true }
                ]
            }
        });

        this.completeChallengesPhase();
    });

    it('stops each character with STR 2 or lower standing', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.serJaimeLannister.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
