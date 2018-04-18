describe('ability requirements', function() {
    integration(function() {
        describe('when an ability meets requirements after its triggering condition is fired', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('lannister', [
                    'A Noble Cause',
                    'Joffrey Baratheon (Core)'
                ]);
                const deck2 = this.buildDeck('martell', [
                    'A Noble Cause',
                    'Ghaston Grey', 'His Viper Eyes'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Joffrey Baratheon', 'hand');

                this.player1.clickCard(this.character);
                this.player2.clickCard('Ghaston Grey', 'hand');
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Return the character to hand
                this.player2.triggerAbility('Ghaston Grey');
                this.player2.clickCard(this.character);
            });

            it('should prompt for the ability', function() {
                expect(this.player2).toAllowAbilityTrigger('His Viper Eyes');
            });
        });
    });
});
