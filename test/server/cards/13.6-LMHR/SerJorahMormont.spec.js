describe('Ser Jorah Mormont (LMHR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { hand: ['Ser Jorah Mormont (LMHR)'] },
            player2: { inPlay: ['Maester Luwin'] }
        });
        this.unopposedChallenge(this.player2, 'Intrigue', this.maesterLuwin);
        this.player1.triggerAbility('Ser Jorah Mormont');
    });

    it('goes into shadows instead of the discard pile when discarded from your hand', function () {
        expect(this.serJorahMormont.location).toBe('shadows');
        expect(this.player2).isReadyToTakeAction();
    });
});
