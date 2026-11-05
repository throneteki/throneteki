describe('Maester Harmune', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Maester Harmune', 'Clydas (DotE)'] },
            player2: { gold: 2, drawDeck: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.clydas);
        this.player1.triggerAbility(this.maesterHarmune);
    });

    it("reveals the top card of the opponent's deck after gold is moved from their pool to yours, discarding it and drawing 1 card if it is a character", function () {
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
