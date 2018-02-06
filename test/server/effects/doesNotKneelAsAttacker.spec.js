describe('doesNotKneelAsAttacker', function() {
    integration(function() {
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
            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
        });

        describe('when the character is declared as an attacker', function() {
            beforeEach(function() {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');
            });

            it('should not kneel the character', function() {
                expect(this.game.currentChallenge.isAttacking(this.character));
                expect(this.character.kneeled).toBe(false);
            });
        });
    });
});
