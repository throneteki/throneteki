describe('Bound for the Wall (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Hedge Knight'],
                hand: ['Bound for the Wall (R)']
            },
            player2: { drawDeck: ['Castle Guard', 'The Roseroad'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Bound for the Wall');
    });

    it("discards the top 2 cards of the losing opponent's deck", function () {
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('discard pile');
    });

    it('puts a character of their choice from their discard pile into play under your control', function () {
        expect(this.player2).not.toBeAbleToSelect(this.theRoseroad);
        this.player2.clickCard(this.castleGuard);
        expect(this.castleGuard.location).toBe('play area');
        expect(this.castleGuard).toBeControlledBy(this.player1);
    });
});
