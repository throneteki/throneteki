describe('Trial by Combat', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Maester Luwin'], hand: ['Trial by Combat'] },
            player2: {
                inPlay: [{ card: 'Castle Guard', kneeling: true }],
                hand: ['Tumblestone Knight']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.maesterLuwin);
        this.player1.triggerAbility('Trial by Combat');
        this.player2.clickCard(this.castleGuard);
    });

    it('applies military claim instead of intrigue claim', function () {
        expect(this.castleGuard.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
