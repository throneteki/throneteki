describe('Marriage Pact', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('greyjoy', [
                'A Noble Cause',
                'Hedge Knight', 'Hedge Knight', 'Marriage Pact'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('Hedge Knight', 'hand');
            this.pact = this.player1.findCardByName('Marriage Pact', 'hand');
            [this.opponentCharacter, this.opponentCharacter2] = this.player2.filterCardsByName('Hedge Knight', 'hand');

            this.player1.clickCard(this.character);
            this.player2.clickCard(this.opponentCharacter);
            this.player2.clickCard(this.opponentCharacter2);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            // Attach Marriage Pact
            this.player1.clickCard(this.pact);
            this.player1.clickCard(this.opponentCharacter);

            this.completeMarshalPhase();
        });

        describe('when the opponent is defender', function() {
            beforeEach(function() {
                this.player1.clickPrompt('Done');

                this.player2.clickPrompt('Military');
            });

            it('should not allow the attached character to attack in a challenge', function() {
                let selectState = this.player2Object.getCardSelectionState(this.opponentCharacter);
                expect(selectState.selectable).toBe(false);
            });
        });

        describe('when the opponent is defender', function() {
            beforeEach(function() {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();
            });

            it('should not allow the attached character to defend in a challenge', function() {
                let selectState = this.player2Object.getCardSelectionState(this.opponentCharacter);
                expect(selectState.selectable).toBe(false);
            });
        });

        describe('when the attached character is killed', function() {
            beforeEach(function() {
                this.unopposedChallenge(this.player1, 'Military', this.character);
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickCard(this.opponentCharacter);
            });

            it('should prompt the player to sacrifice a character', function() {
                expect(this.player1).toHavePrompt('Select a character');
                this.player1.clickCard(this.character);
                expect(this.character.location).toBe('discard pile');
            });
        });
    });
});
