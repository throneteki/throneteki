describe('Burning the Dead', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Burning the Dead'],
                deadPile: ['Castle Guard'],
                drawDeck: ['Ranging Party']
            },
            player2: { deadPile: ['Hedge Knight', 'Robb Stark (Core)'] }
        });
        this.player1.clickCard(this.burningTheDead);
    });

    it('removes each non-unique character in each dead pile from the game and draws 1 card', function () {
        expect(this.castleGuard.location).toBe('out of game');
        expect(this.hedgeKnight.location).toBe('out of game');
        expect(this.robbStark.location).toBe('dead pile');
        expect(this.rangingParty.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
