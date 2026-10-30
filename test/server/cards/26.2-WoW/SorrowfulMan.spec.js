describe('Sorrowful Man', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Sorrowful Man (WoW)'] },
            player2: { discard: ['Hedge Knight'], deadPile: ['Castle Guard'] }
        });
        this.player1.clickCard(this.sorrowfulMan);
        this.player1.triggerAbility('Sorrowful Man');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
    });

    it("switches a character in an opponent's discard pile with one in their dead pile after it comes out of shadows", function () {
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.castleGuard.location).toBe('discard pile');
    });
});
