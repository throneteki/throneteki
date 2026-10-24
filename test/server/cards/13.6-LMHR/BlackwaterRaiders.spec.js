describe('Blackwater Raiders', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'greyjoy', shadows: ['Blackwater Raiders'], gold: 3 },
            player2: { discard: ['Sweet Cersei'] }
        });
        this.player1.clickCard(this.blackwaterRaiders);
        this.player1.triggerAbility(this.blackwaterRaiders);
        this.player1.clickCard(this.sweetCersei);
    });

    it("puts a location with printed cost 2 or lower from an opponent's discard pile into play under your control after it comes out of shadows", function () {
        expect(this.sweetCersei.location).toBe('play area');
        expect(this.sweetCersei.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
