describe("The Queen's Retinue", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ["The Queen's Retinue (LMHR)"] }
        });
        this.opponentHandSize = this.player2Object.hand.length;
        this.player1.clickCard(this.theQueensRetinue);
        this.player1.clickPrompt('Put into play');
    });

    it('puts itself into play from shadows, then each opponent draws 2 cards', function () {
        expect(this.theQueensRetinue.location).toBe('play area');
        expect(this.player2Object.hand.length).toBe(this.opponentHandSize + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
