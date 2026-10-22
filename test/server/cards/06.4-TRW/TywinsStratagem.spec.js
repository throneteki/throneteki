describe("Tywin's Stratagem", function () {
    it("returns a character with printed cost 2 or lower controlled by each player to its owner's hand", function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], hand: ["Tywin's Stratagem"] },
            player2: { inPlay: ['Winterfell Steward'] }
        });
        this.player1.clickCard(this.tywinsStratagem);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.winterfellSteward.location).toBe('hand');
    });

    it("pays 1 gold to return itself to your hand after a character is discarded from an opponent's hand", function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Black Walder'], discard: ["Tywin's Stratagem"] },
            player2: { hand: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.blackWalder);
        this.player1.triggerAbility("Tywin's Stratagem");
        expect(this.tywinsStratagem.location).toBe('hand');
    });
});
