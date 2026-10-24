describe('The Red Fork', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Jaime Lannister (Core)'], discard: ['The Red Fork'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
        this.player1.triggerAbility(this.theRedFork);
    });

    it('puts itself into play from your discard pile after you win a military challenge by 5 or more STR', function () {
        expect(this.theRedFork.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
