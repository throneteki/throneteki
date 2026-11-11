describe('Myrcella Baratheon (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Myrcella Baratheon (SoD)'],
                hand: ['Tumblestone Knight']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.myrcellaBaratheon);
    });

    it('does not kneel when attacking an opponent with fewer cards in hand than you', function () {
        expect(this.myrcellaBaratheon.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
