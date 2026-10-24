describe('Yoren (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'thenightswatch', hand: ['Yoren (Core)'], gold: 3 },
            player2: { discard: ['Burned Men'] }
        });
        this.player1.clickCard(this.yoren);
        this.player1.triggerAbility(this.yoren);
        this.player1.clickCard(this.burnedMen);
    });

    it("puts a character with printed cost 3 or lower from an opponent's discard pile into play under your control after you marshal him", function () {
        expect(this.burnedMen.location).toBe('play area');
        expect(this.burnedMen.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
