describe('Master of Whispers', function() {
    integration({ isMelee: true }, function() {
        describe('applying intrigue claim', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Sansa Stark (Core)', 'Sansa Stark (Core)', 'Sansa Stark (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.player3.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Sansa Stark', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.selectTitle('Master of Whispers');
                this.player2.selectTitle('Master of Coin');
                this.player3.selectTitle('Master of Laws');

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickPrompt('player2');
                this.player1.clickCard('Sansa Stark', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');
            });

            it('should prompt to apply claim to additional players', function() {
                expect(this.player1).toHavePromptButton('player3');
            });

            it('should allow it to only be applied to the defending player', function() {
                this.player1.clickPrompt('Done');

                expect(this.player3Object.discardPile.length).toBe(0);
            });

            it('should apply it to selected players', function() {
                this.player1.clickPrompt('player3');

                expect(this.player2Object.discardPile.length).toBe(1);
                expect(this.player3Object.discardPile.length).toBe(1);
            });
        });

        describe('vs Trial by Combat', function() {

        });

        describe('vs Vengeance for Elia', function() {

        });

        describe('vs other replacement effects', function() {

        });
    });
});
