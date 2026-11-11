describe("The Imp's Agent", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["The Imp's Agent (WoW)"] },
            player2: { hand: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.theImpsAgent);
        this.player1.triggerAbility("The Imp's Agent");
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Bottom');
    });

    it('returns to shadows to have the loser place a card from hand on the top or bottom of their deck', function () {
        expect(this.theImpsAgent.location).toBe('shadows');
        expect(this.player2Object.drawDeck.at(-1)).toBe(this.hedgeKnight);
    });
});
