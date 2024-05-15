describe('Gifts for the Widow', function () {
    integration(function () {
        describe('when the player has no gold', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Gifts for the Widow (R)',
                    'Eddard Stark (Core)',
                    'Noble Lineage'
                ]);

                this.player1.togglePromptedActionWindow('draw', true);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Eddard Stark', 'hand');
                this.player1.clickCard(this.character);

                this.attachment = this.player1.findCardByName('Noble Lineage', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Move Noble Lineage back into the deck for searching
                this.player1.dragCard(this.attachment, 'draw deck');

                // Play Gifts for the Widow during the draw phase action window
                // when neither player has gold
                this.player1.clickCard('Gifts for the Widow', 'hand');
                this.player1.selectValue('0');
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);
            });

            it('works', function () {
                expect(this.character.attachments).toContain(this.attachment);
            });

            it('allows the player to collect income', function () {
                this.player2.clickPrompt('Pass');
                this.player1.clickPrompt('Pass');

                expect(this.player1Object.gold).toBe(5);
            });
        });
    });
});
