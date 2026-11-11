describe('Vanguard of the North', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Jousting Contest (Core)',
                inPlay: ['Vanguard of the North']
            }
        });

        this.unopposedChallenge(this.player1, 'Military', this.vanguardOfTheNorth);
    });

    it('does not kneel when attacking in a [military] challenge while a War plot is revealed', function () {
        expect(this.vanguardOfTheNorth.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
