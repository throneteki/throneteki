describe('Morningstar', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Hedge Knight', attachments: ['Morningstar'] }] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Morningstar');
    });

    it('stands the attached character and removes it from the challenge', function () {
        expect(this.morningstar.kneeled).toBe(true);
        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
