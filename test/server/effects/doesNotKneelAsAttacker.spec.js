describe('doesNotKneelAsAttacker', function() {
    integration(function() {
        describe('when the character is declared as an attacker', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Ser Jaime Lannister (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Ser Jaime Lannister');
                this.player1.clickCard(this.character);

                this.completeSetup();
                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');
            });

            it('should not kneel the character', function() {
                expect(this.game.currentChallenge.isAttacking(this.character));
                expect(this.character.kneeled).toBe(false);
            });
        });

        describe('when there are multiple does-not-kneel effects in play', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'The Blackfish (WotN)', 'The Wolf King'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('The Blackfish');
                this.player1.clickCard(this.character);
                this.player1.clickCard('The Wolf King', 'hand');
                this.completeSetup();

                // Setup attachments
                this.player1.clickCard('The Wolf King', 'play area');
                this.player1.clickCard(this.character);

                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();

                // Set 4 power on Blackfish so he receives the does-not-kneel effect
                this.character.power = 4;

                // Both the Wolf King and Blackfish effects should keep him standing
                this.unopposedChallenge(this.player1, 'Military', this.character);
                this.player1.clickPrompt('Continue');

                expect(this.character.kneeled).toBe(false);

                // Initiate a non-military challenge
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');
            });

            it('should not reset the original effect', function() {
                // Blackfish should still be standing from his own effect
                expect(this.character.kneeled).toBe(false);
            });
        });
    });
});
