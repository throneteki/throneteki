describe('The Green Fork (TTS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Jaime Lannister (Core)'], discard: ['The Green Fork (TTS)'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.serJaimeLannister);
        this.player1.triggerAbility(this.theGreenFork);
    });

    it('puts itself into play from your discard pile after you win a intrigue challenge by 5 or more STR', function () {
        expect(this.theGreenFork.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
