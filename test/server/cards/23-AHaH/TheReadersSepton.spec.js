describe("The Reader's Septon", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ["The Reader's Septon"] },
            player2: { drawDeck: ['Hedge Knight'] }
        });
        this.bottomCard = this.player2Object.drawDeck.at(-1);
        this.player1.clickCard(this.theReadersSepton);
        this.player1.clickPrompt('player2');
    });

    it("kneels to switch the top and bottom cards of the chosen player's deck", function () {
        expect(this.theReadersSepton.kneeled).toBe(true);
        expect(this.player2Object.drawDeck[0]).toBe(this.bottomCard);
        expect(this.player2Object.drawDeck.at(-1)).toBe(this.hedgeKnight);
        expect(this.player1).isReadyToTakeAction();
    });
});
