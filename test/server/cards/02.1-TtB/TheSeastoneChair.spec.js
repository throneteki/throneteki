describe('The Seastone Chair', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Seastone Chair', 'Hedge Knight'] },
            player2: {
                inPlay: [
                    { card: 'Castle Guard', kneeling: true },
                    { card: 'Tumblestone Knight', kneeling: true }
                ]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('The Seastone Chair');
        this.player1.clickCard(this.castleGuard);
    });

    it('kneels your faction card to kill a character of your choice instead of the normal claim', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.castleGuard.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
