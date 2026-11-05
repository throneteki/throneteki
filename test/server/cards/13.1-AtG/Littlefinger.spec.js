describe('Littlefinger (AtG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                shadows: ['Littlefinger (AtG)'],
                hand: ['Hedge Knight', 'Castle Guard'],
                drawDeck: ['The Roseroad', 'The Kingsroad'],
                gold: 10
            }
        });
        this.player1.clickCard(this.littlefinger);
        this.player1.triggerAbility('Littlefinger');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it('places up to 3 cards from your hand on the bottom of your deck and draws that many after a character comes out of shadows', function () {
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.castleGuard.location).toBe('draw deck');
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.theKingsroad.location).toBe('hand');
    });
});
