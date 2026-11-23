describe('Your King Commands It', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Your King Commands It',
                inPlay: ['Khal Drogo (Core)', 'Robb Stark (AtSK)']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', [this.khalDrogo, this.robbStark]);
    });

    it('stops each non-King, non-Queen character gaining power', function () {
        expect(this.khalDrogo.power).toBe(0);
        expect(this.robbStark.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
