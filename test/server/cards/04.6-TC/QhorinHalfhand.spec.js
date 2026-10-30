describe('Qhorin Halfhand', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'thenightswatch', inPlay: ['Qhorin Halfhand'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.qhorinHalfhand);
        this.player1.triggerAbility(this.qhorinHalfhand);
        this.player1.clickCard(this.burnedMen);
    });

    it('kills a non-unique character with lower STR controlled by the losing opponent after you win a military challenge he is participating in', function () {
        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
