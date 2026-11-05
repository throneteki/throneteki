describe('Anguy the Archer', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Anguy the Archer']
            }
        });

        this.unopposedChallenge(this.player1, 'Military', this.anguyTheArcher);
    });

    it('does not kneel when attacking in a [military] challenge while you control no loyal characters', function () {
        expect(this.anguyTheArcher.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
