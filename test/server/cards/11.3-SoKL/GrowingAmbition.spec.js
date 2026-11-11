describe('Growing Ambition', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                shadows: ['Growing Ambition'],
                drawDeck: ['Hedge Knight', 'Castle Guard', 'The Roseroad'],
                discard: ['The Kingsroad'],
                gold: 5
            }
        });
        this.player1.clickCard(this.growingAmbition);
        this.player1.selectValue(2);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it("places X different cards from your deck in your discard pile, then returns X of an opponent's choice to your hand", function () {
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('discard pile');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.theKingsroad);
        this.player2.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.theKingsroad.location).toBe('hand');
        expect(this.castleGuard.location).toBe('discard pile');
    });
});
