describe('Mya Stone', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: [{ card: 'Mya Stone', kneeling: false }, 'Castle Guard'], power: 2 },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Mya Stone');
    });

    it('kneels to apply power claim instead of military claim when you are defending', function () {
        expect(this.myaStone.kneeled).toBe(true);
        expect(this.castleGuard.location).toBe('play area');
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
