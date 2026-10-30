describe('Seen In Flames', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Fiery Followers'], hand: ['Seen In Flames'], gold: 1 },
            player2: { hand: ['Hot Pie (FFH)', 'Burned Men'] }
        });
        this.player1.clickCard(this.seenInFlames);
    });

    it("looks at an opponent's hand and discards a card of your choice from it", function () {
        expect(this.player2).not.toHavePrompt('Select a card to discard');

        this.player1.clickCard(this.hotPie);

        expect(this.hotPie.location).toBe('discard pile');
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
