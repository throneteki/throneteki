describe('The New Gods', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'The New Gods',
                inPlay: ['Septon Utt (HMW)']
            }
        });

        this.unopposedChallenge(this.player1, 'Intrigue', this.septonUtt);
    });

    it('stops each The Seven character you control kneeling when attacking in your first challenge', function () {
        expect(this.septonUtt.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
