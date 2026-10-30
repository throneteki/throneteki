describe('The Brotherhood Without Banners', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'The Brotherhood Without Banners', inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility('The Brotherhood Without Banners');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Stealth');
    });

    it('kneels your faction card to give a neutral character a keyword after the challenges phase begins', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.hasKeyword('Stealth')).toBe(true);
    });
});
