describe('Moon Brothers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Burned Men'], hand: ['Moon Brothers'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.moonBrothers);
    });

    it('kneels your faction card to put itself into play attacking', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.moonBrothers.location).toBe('play area');
        expect(this.moonBrothers.kneeled).toBe(false);
        expect(this.moonBrothers.isAttacking()).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
