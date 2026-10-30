describe('Ser Boros Blount (JS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Ser Boros Blount (JS)'], drawDeck: ['Hedge Knight'], gold: 10 }
        });
        this.player1.clickCard(this.serBorosBlount);
        this.player1.clickPrompt('Marshal');
        this.player1.triggerAbility('Ser Boros Blount');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('puts a non-Lannister Knight from the top 10 cards of your deck into play after it enters play, and discards it at the end of the phase', function () {
        expect(this.hedgeKnight.location).toBe('play area');
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('discard pile');
    });
});
