describe('Ser Cortnay Penrose', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'baratheon', inPlay: ['Ser Cortnay Penrose'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.serCortnayPenrose);
        this.player1.triggerAbility(this.serCortnayPenrose);
    });

    it('stands after you win a power challenge he is participating in', function () {
        expect(this.serCortnayPenrose.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
