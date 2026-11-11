describe('White Graces', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Sansa Stark (Core)'], hand: ['White Graces'] },
            player2: { inPlay: ['Maester Luwin'] }
        });
        this.unopposedChallenge(this.player2, 'Intrigue', this.maesterLuwin);
        this.player1.triggerAbility('White Graces');
        this.player1.clickCard(this.sansaStark);
    });

    it('goes on a unique Lady or Grace character as a duplicate instead of the discard pile', function () {
        expect(this.whiteGraces.location).toBe('duplicate');
        expect(this.sansaStark.dupes).toContain(this.whiteGraces);
        expect(this.player2).isReadyToTakeAction();
    });
});
