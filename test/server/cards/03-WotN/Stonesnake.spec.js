describe('Stonesnake', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Stonesnake'] },
            player2: { inPlay: ['Raiding Khalasar'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.stonesnake);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.raidingKhalasar);
        this.player1.triggerAbility('Stonesnake');
        this.player1.clickPrompt('Pillage');
    });

    it('gains a keyword of the character it bypassed using stealth until the end of the phase', function () {
        expect(this.stonesnake.hasKeyword('Pillage')).toBe(true);
    });
});
