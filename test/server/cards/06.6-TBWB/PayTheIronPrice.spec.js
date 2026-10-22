describe('Pay The Iron Price', function () {
    it("puts an attachment from an opponent's discard pile into play under your control", function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], hand: ['Pay The Iron Price'] },
            player2: { discard: ['Little Bird (Core)'] }
        });
        this.player1.clickCard(this.payTheIronPrice);
        this.player1.clickCard(this.littleBird);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.littleBird.location).toBe('play area');
        expect(this.littleBird.controller).toBe(this.player1Object);
    });

    it('pays 1 gold to return itself to your hand after you win an unopposed challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Hedge Knight'], discard: ['Pay The Iron Price'] }
        });
        this.startingGold = this.player1Object.gold;
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Pay The Iron Price');
        expect(this.payTheIronPrice.location).toBe('hand');
        expect(this.player1Object.gold).toBe(this.startingGold - 1);
    });
});
