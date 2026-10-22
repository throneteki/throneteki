describe('City Gates', function () {
    describe('when used from your hand', function () {
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

    describe('when in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { inPlay: ['City Gates'] }
            });
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('raises your income by 1', function () {
            expect(this.player1Object.gold).toBe(6);
            expect(this.player2Object.gold).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
