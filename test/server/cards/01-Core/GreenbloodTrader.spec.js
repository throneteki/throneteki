describe('Greenblood Trader', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Greenblood Trader'],
                drawDeck: ['Hedge Knight', 'Castle Guard'],
                gold: 5
            }
        });
        this.player1.clickCard(this.greenbloodTrader);
        this.player1.triggerAbility('Greenblood Trader');
        this.player1.clickPrompt('Done');
    });

    it('looks at the top 2 cards after it enters play, adding up to 1 to hand and placing the other on the bottom', function () {
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('hand');
        const deck = this.player1Object.drawDeck;
        expect(deck[deck.length - 1]).toBe(this.castleGuard);
    });

    it('can place both on the bottom', function () {
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.player1Object.drawDeck.slice(-2)).toContain(this.hedgeKnight);
    });
});
