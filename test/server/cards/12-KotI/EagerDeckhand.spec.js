describe('Eager Deckhand', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'greyjoy', hand: ['Eager Deckhand', 'Iron Fleet Scout'], gold: 0 }
        });
        this.player1.clickCard(this.ironFleetScout);
        this.player1.triggerAbility(this.eagerDeckhand);
    });

    it('puts itself into play from your hand after a Warship location enters play under your control', function () {
        expect(this.eagerDeckhand.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
