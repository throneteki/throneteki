describe('House Florent Knight', function () {
    describe('when there is a lower strength character out', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { hand: ['Hedge Knight'] },
                player2: { hand: ['House Florent Knight'] }
            });
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.houseFlorentKnight);
        });

        it('discards the character with the lowest STR in play', function () {
            expect(this.player2).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player2).not.toBeAbleToSelect(this.houseFlorentKnight);

            this.player2.clickCard(this.hedgeKnight);

            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when House Florent Knight would be the lowest strength', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { hand: ['House Florent Knight'] }
            });
            this.player1.clickCard(this.houseFlorentKnight);
        });

        it('discards House Florent Knight', function () {
            this.player1.clickCard(this.houseFlorentKnight);

            expect(this.houseFlorentKnight.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
