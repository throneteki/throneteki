describe("Caswell's Keep", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { faction: 'tyrell', inPlay: ["Caswell's Keep"] },
            player2: { drawDeck: ['Hedge Knight', 'Winterfell Steward', 'Burned Men'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility("Caswell's Keep");
        this.player1.clickPrompt('player2');
    });

    it("looks at the top 2 cards of a player's deck and places 1 on the bottom and the other on top", function () {
        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        expect(this.player1).toBeAbleToSelect(this.winterfellSteward);
        expect(this.player1).not.toBeAbleToSelect(this.burnedMen);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.player2Object.drawDeck.at(-1)).toBe(this.hedgeKnight);
        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.burnedMen.location).toBe('hand');
    });
});
