describe('Ser Waymar Royce', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Waymar Royce'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'], hand: ['Hot Pie (FFH)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.serWaymarRoyce);
        this.player1.triggerAbility(this.serWaymarRoyce);
    });

    it("discards 1 card at random from each opponent's hand when he is killed", function () {
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
