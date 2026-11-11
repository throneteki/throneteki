describe("Captain's Daughter", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            firstPlayer: 'player2',
            player1: { inPlay: ["Captain's Daughter"] },
            player2: { hand: ['Hedge Knight'] }
        });
        this.player2.clickCard(this.hedgeKnight);
        this.player1.triggerAbility("Captain's Daughter");
    });

    it("sacrifices itself and kneels your faction card to put a non-loyal character on top of its owner's deck", function () {
        expect(this.captainsDaughter.location).toBe('discard pile');
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player2Object.drawDeck[0]).toBe(this.hedgeKnight);
        expect(this.player2).isReadyToTakeAction();
    });
});
