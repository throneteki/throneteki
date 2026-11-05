describe('Coastal Reaver', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Coastal Reaver'] },
            player2: { hand: ['Hedge Knight', 'Castle Guard'] }
        });
        this.player1.clickCard(this.coastalReaver);
        this.player1.triggerAbility('Coastal Reaver');
        this.player2.clickCard(this.castleGuard);
    });

    it('has an opponent place a card from their hand on top of their deck', function () {
        expect(this.player2Object.drawDeck[0]).toBe(this.castleGuard);
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
