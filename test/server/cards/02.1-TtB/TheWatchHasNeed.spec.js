describe('The Watch Has Need', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['The Watch Has Need'],
                    drawDeck: ['Veteran Builder', 'Old Forest Hunter']
                }
            });
            this.player1.clickCard(this.theWatchHasNeed);
            this.player1.clickPrompt('Builder');
            this.player1.clickCard(this.veteranBuilder);
            this.player1.clickPrompt('Done');
        });

        it('names a trait and adds characters with it from the top X cards of your deck to your hand', function () {
            expect(this.veteranBuilder.location).toBe('hand');
            expect(this.oldForestHunter.location).toBe('draw deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
