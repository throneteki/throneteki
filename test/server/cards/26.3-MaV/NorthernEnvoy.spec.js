describe('Northern Envoy', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Northern Envoy'], gold: 10 },
            player2: { drawDeck: ['Hedge Knight', 'The Roseroad', 'Robb Stark (Core)'] }
        });
        this.player1.clickCard(this.northernEnvoy);
        this.player1.triggerAbility('Northern Envoy');
    });

    it("reveals the top 10 cards of an opponent's deck and places a non-unique character from them in their discard pile", function () {
        expect(this.player1).not.toAllowSelect(this.robbStark);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.robbStark.location).toBe('draw deck');
    });
});
