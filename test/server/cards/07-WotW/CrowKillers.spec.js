describe('Crow Killers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Sneak Attack',
                inPlay: ['Crow Killers']
            }
        });

        this.unopposedChallenge(this.player1, 'Military', this.crowKillers);
    });

    it('does not kneel when attacking an opponent whose reserve is higher than yours', function () {
        expect(this.crowKillers.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
