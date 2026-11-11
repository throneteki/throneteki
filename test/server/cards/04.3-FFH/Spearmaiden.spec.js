describe('Spearmaiden', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Spearmaiden', 'Raiding Khalasar'] },
            player2: { inPlay: ['Hedge Knight', 'Castle Guard'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.spearmaiden);
        this.player1.clickCard(this.raidingKhalasar);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Spearmaiden');
        this.player1.clickCard(this.hedgeKnight);
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('forces the chosen character to be chosen for claim after winning by 5 or more STR', function () {
        expect(this.player2).not.toAllowSelect(this.castleGuard);
        this.player2.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.castleGuard.location).toBe('play area');
    });
});
