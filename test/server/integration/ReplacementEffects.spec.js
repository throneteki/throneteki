describe('replacement effects', function () {
    integration(function () {
        describe('when a replacement effect is applied', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('thenightswatch', [
                    'A Noble Cause',
                    'Benjen Stark (Core)'
                ]);
                const deck2 = this.buildDeck('lannister', [
                    'A Noble Cause',
                    'Chella Daughter of Cheyk'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.benjen = this.player1.findCardByName('Benjen Stark', 'hand');
                this.chella = this.player2.findCardByName('Chella Daughter of Cheyk', 'hand');

                this.player1.clickCard(this.benjen);
                this.player2.clickCard(this.chella);

                this.completeSetup();

                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player2, 'military', this.chella);
                this.player2.clickPrompt('Apply Claim');

                // Choose Benjen for claim
                this.player1.clickCard(this.benjen);
                this.player1.triggerAbility('Benjen Stark');
            });

            it('should replace the effect', function () {
                expect(this.benjen.location).toBe('draw deck');
            });

            it('should still be considered to have happened', function () {
                // Chella should gain an ear token from Benjen dying
                this.player2.triggerAbility('Chella Daughter of Cheyk');

                expect(this.chella.tokens.ear).toBe(1);
            });
        });

        describe('when a multiple replacement effects are applied', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('thenightswatch', [
                    'A Noble Cause',
                    'Mirri Maz Duur',
                    'Hedge Knight'
                ]);
                const deck2 = this.buildDeck('lannister', [
                    'A Noble Cause',
                    'Vengeance for Elia',
                    'Hedge Knight',
                    'Hedge Knight'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.mirri = this.player1.findCardByName('Mirri Maz Duur', 'hand');
                this.character = this.player2.findCardByName('Hedge Knight', 'hand');

                this.player1.clickCard(this.mirri);
                this.player2.clickCard(this.character);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player1, 'intrigue', this.mirri);
                this.player1.clickPrompt('Apply Claim');

                // Player 1 attempts to trigger Mirri to kill the character
                this.player1.triggerAbility('Mirri Maz Duur');
                this.player1.clickCard(this.character);

                // Player 2 applies the claim back to the attacker
                this.player2.triggerAbility('Vengeance for Elia');
            });

            it('should replace the original effect', function () {
                // Vengeance for Elia is in discard but no other card is discarded
                expect(this.player2Object.hand.length).toBe(1);
                expect(this.player2Object.discardPile.length).toBe(1);
            });

            it('should not use the first replacement', function () {
                // The character chosen by Mirri is not killed
                expect(this.character.location).toBe('play area');
            });

            it('should use the final replacement', function () {
                // Vengeance for Elia discards 1 card from player 1.
                expect(this.player1Object.hand.length).toBe(0);
                expect(this.player1Object.discardPile.length).toBe(1);
            });
        });
    });
});
