describe('Bastard Daughter', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Bastard Daughter'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'], hand: ['Hot Pie (FFH)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.bastardDaughter);
        this.player1.triggerAbility(this.bastardDaughter);
    });

    it("discards 1 card at random from each opponent's hand when she is killed", function () {
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
