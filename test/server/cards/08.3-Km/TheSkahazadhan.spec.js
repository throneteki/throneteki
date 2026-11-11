describe('The Skahazadhan', function () {
    describe('after you reveal a plot card', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { inPlay: ['The Skahazadhan'], hand: ['Hedge Knight'] },
                player2: { power: 1 }
            });
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
            this.goldBefore = this.player1Object.gold;
            this.player1.triggerAbility(this.theSkahazadhan);
            this.player1.clickCard(this.hedgeKnight);
        });

        it('kneels and discards 1 card from your hand to gain 2 gold', function () {
            expect(this.player1Object.gold).toBe(this.player1Object.activePlot.getIncome() + 2);
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.theSkahazadhan.kneeled).toBe(true);
        });
    });
});
