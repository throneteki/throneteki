describe('Harrenhal Cupbearer (WAID)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Harrenhal Cupbearer (WAID)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.harrenhalCupbearer);
        this.player1.triggerAbility(this.harrenhalCupbearer);
    });

    it('returns to shadows to kneel a character with printed cost 5 or lower the losing opponent controls after a challenge it wins', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.harrenhalCupbearer.location).toBe('shadows');
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
