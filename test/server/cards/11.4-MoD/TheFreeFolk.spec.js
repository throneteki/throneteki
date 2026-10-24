describe('The Free Folk', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'The Free Folk (MoD)', inPlay: ['Northern Refugee'] },
            player2: { hand: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.northernRefugee);
        this.player1.triggerAbility('The Free Folk');
        this.player1.clickPrompt('Intrigue');
    });

    it('kneels your faction card to apply the claim of another challenge type after claim is applied', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('discard pile');
    });
});
