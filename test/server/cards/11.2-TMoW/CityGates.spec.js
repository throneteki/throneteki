describe('City Gates', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['City Gates'],
                inPlay: ['Tumblestone Knight'],
                drawDeck: ['Hot Pie (FFH)'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.cityGates);
    });

    it('pays 1 gold and discards itself from your hand to draw 1 card', function () {
        expect(this.cityGates.location).toBe('discard pile');
        expect(this.hotPie.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
