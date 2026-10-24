describe('Chiswyck', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Chiswyck'],
                drawDeck: ['Hot Pie (FFH)', 'Burned Men']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.chiswyck);
        this.player1.triggerAbility(this.chiswyck);
    });

    it('discards the top card of your deck to draw 1 card after you win a challenge he is participating in', function () {
        expect(this.player1Object.discardPile).toHaveLength(1);
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
