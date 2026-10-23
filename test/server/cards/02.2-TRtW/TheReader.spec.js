describe('The Reader (TRtW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Reader (TRtW)'], drawDeck: ['Hedge Knight'] },
            player2: {
                drawDeck: ['Castle Guard', 'Winterfell Steward', 'The Roseroad', 'The Kingsroad']
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.theReader);
        this.player1.triggerAbility('The Reader');
    });

    it('draws 1 card after you win an unopposed challenge with a unique Greyjoy character', function () {
        this.player1.clickPrompt('Draw 1 card');
        expect(this.hedgeKnight.location).toBe('hand');
    });

    it("or discards the top 3 cards of each opponent's deck", function () {
        this.player1.clickPrompt('Discard 3 cards');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.theKingsroad.location).toBe('draw deck');
    });
});
