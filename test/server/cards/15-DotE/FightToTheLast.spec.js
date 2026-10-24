describe('Fight to the Last', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: [{ card: 'Robb Stark (Core)', kneeling: true }],
                hand: ['Fight to the Last']
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.robbStark);
        this.player1.triggerAbility('Fight to the Last');
    });

    it('saves a character you control, stands it and sets its STR to 1', function () {
        expect(this.robbStark.location).toBe('play area');
        expect(this.robbStark.kneeled).toBe(false);
        expect(this.robbStark.getStrength()).toBe(1);
    });

    it('kills it at the end of the phase if it is still in play', function () {
        this.player2.clickPrompt('Done');
        expect(this.robbStark.location).toBe('dead pile');
    });
});
