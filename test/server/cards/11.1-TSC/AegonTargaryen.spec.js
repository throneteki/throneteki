describe('Aegon Targaryen (TSC)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Aegon Targaryen (TSC)'],
                drawDeck: ['Ranging Party'],
                gold: 10
            }
        });
        this.player1.clickCard(this.aegonTargaryen);
        this.player1.clickPrompt('Marshal');
        this.player1.triggerAbility('Aegon Targaryen');
        this.player1.clickCard(this.rangingParty);
    });

    it('searches your deck for an Army or Mercenary character after it enters play and puts it into play until the end of the phase', function () {
        expect(this.rangingParty.location).toBe('play area');
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.rangingParty.location).toBe('hand');
    });
});
