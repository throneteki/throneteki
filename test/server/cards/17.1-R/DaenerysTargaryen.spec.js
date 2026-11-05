describe('Daenerys Targaryen (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Daenerys Targaryen (R)'], drawDeck: ['Drogon (Core)'] }
        });
        this.player1.clickMenu(this.daenerysTargaryen, 'Search deck');
        this.player1.clickCard(this.drogon);
    });

    it('kneels your faction card to put a Dragon from the top 10 cards of your deck into play until the end of the phase', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.drogon.location).toBe('play area');
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.drogon.location).toBe('hand');
    });
});
