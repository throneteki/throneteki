describe('Nightfall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Harlaw Scout (TSoW)', attachments: ['Nightfall'] }] }
        });
    });

    it('gives an attached House Harlaw character renown, and kneels to have each player check reserve after you win a challenge it participates in', function () {
        expect(this.harlawScout.hasKeyword('renown')).toBe(true);

        this.unopposedChallenge(this.player1, 'Military', this.harlawScout);
        this.player1.triggerAbility(this.nightfall);

        expect(this.nightfall.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
