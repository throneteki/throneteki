describe('Blessed by the Maiden', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('tyrell', [
                'A Noble Cause',
                'Hedge Knight',
                'Milk of the Poppy',
                'Blessed by the Maiden'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('Hedge Knight', 'hand');
            this.attachment = this.player1.findCardByName('Milk of the Poppy', 'hand');

            this.player1.clickCard(this.character);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when attached', function () {
            beforeEach(function () {
                this.player1.clickCard('Blessed by the Maiden', 'hand');
                this.player1.clickCard(this.character);
            });

            it('should not allow non-blessing attachments', function () {
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);

                expect(this.character.attachments).not.toContain(this.attachment);
            });
        });

        describe('when a character already has attachments', function () {
            beforeEach(function () {
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);
            });

            it('should discard existing attachments when attached', function () {
                this.player1.clickCard('Blessed by the Maiden');
                this.player1.clickCard(this.character);

                expect(this.attachment.location).toBe('discard pile');
            });
        });
    });
});
