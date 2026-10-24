describe('Karhold', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Karhold', 'Ser Jaime Lannister (Core)']
            }
        });

        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
    });

    it('stops characters and locations gaining power while their controller has no Winter plot revealed', function () {
        expect(this.serJaimeLannister.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
