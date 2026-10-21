describe('Ser Jaime Lannister (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
    });

    it('does not kneel when attacking in a [military] challenge, and gains renown while participating in one', function () {
        expect(this.serJaimeLannister.kneeled).toBe(false);
        expect(this.serJaimeLannister.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
