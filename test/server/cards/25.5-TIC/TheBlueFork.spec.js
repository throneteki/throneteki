describe('The Blue Fork', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Khal Drogo (Core)'], discard: ['The Blue Fork'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);
        this.player1.triggerAbility(this.theBlueFork);
    });

    it('puts itself into play from your discard pile after you win a power challenge by 5 or more STR', function () {
        expect(this.theBlueFork.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
