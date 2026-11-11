describe('Crannogmen', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Crannogmen (AHaH)'] },
            player2: { inPlay: [{ card: 'Hedge Knight', kneeling: true }], hand: ['Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.crannogmen);
        this.player1.triggerAbility('Crannogmen');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('returns to shadows to kill a character instead of the normal claim', function () {
        expect(this.crannogmen.location).toBe('shadows');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.castleGuard.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
