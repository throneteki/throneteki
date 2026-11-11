describe('Temple of the Graces', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Temple of the Graces', 'Blue Graces', 'Hedge Knight'] },
            player2: {
                inPlay: [{ card: 'Tumblestone Knight', kneeling: true }],
                hand: ['Castle Guard']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Temple of the Graces');
        this.player1.clickCard(this.blueGraces);
    });

    it('kneels a Grace card to apply intrigue claim instead of military claim', function () {
        expect(this.blueGraces.kneeled).toBe(true);
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
