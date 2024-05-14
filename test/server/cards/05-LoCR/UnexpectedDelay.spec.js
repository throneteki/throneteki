describe('Unexpected Delay', function () {
    integration(function () {
        describe('when both players choose the same character', function () {
            beforeEach(function () {
                const deck = this.buildDeck('lannister', [
                    'Unexpected Delay',
                    'A Noble Cause',
                    'Cersei Lannister (Core)',
                    'Cersei Lannister (Core)'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.character, this.dupe] = this.player1.filterCardsByName(
                    'Cersei Lannister',
                    'hand'
                );

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.dupe);
                this.completeSetup();

                this.player1.selectPlot('Unexpected Delay');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickCard(this.character);
                this.player2.clickCard(this.character);
            });

            it('only attempts to return the character to hand once', function () {
                // The single dupe should be sufficient to save the character.
                expect(this.character.location).toBe('play area');
                expect(this.dupe.location).toBe('discard pile');
            });
        });
    });
});
