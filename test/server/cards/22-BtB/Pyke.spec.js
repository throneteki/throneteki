describe('Pyke (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Pyke (BtB)'], hand: ['Refurbished Hulk'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickCard(this.refurbishedHulk);
        this.player1.triggerAbility('Pyke');
        this.player1.clickCard(this.hedgeKnight);
    });

    it("places a card on top of its owner's deck, and that player draws 1 card at the end of the phase", function () {
        expect(this.pyke.kneeled).toBe(true);
        expect(this.player2Object.drawDeck[0]).toBe(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
