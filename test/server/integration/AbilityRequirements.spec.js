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

        describe('when an ability leaves a playable area and re-enters a playable area', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('lannister', [
                    'A Noble Cause',
                    'Cersei Lannister (Core)', 'Lannisport', 'Maester at the Rock', 'Without His Beard'
                ]);
                const deck2 = this.buildDeck('martell', [
                    'A Noble Cause',
                    'Ghaston Grey', 'Ghaston Grey', 'Ghaston Grey',
                    'His Viper Eyes', 'His Viper Eyes', 'His Viper Eyes',
                    'Doran Martell (Core)', 'Doran Martell (Core)', 'Doran Martell (Core)',
                    'Areo Hotah (Core)', 'Areo Hotah (Core)', 'Areo Hotah (Core)'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Maester at the Rock', 'hand');
                this.player1.clickCard('Lannisport', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickCard('Cersei Lannister', 'hand');

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Cersei Lannister', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.triggerAbility('Without His Beard');
                this.player1.clickPrompt('3');
                // Skip order of discarded cards
                this.player2.clickPrompt('Done');
                this.player1.triggerAbility('Maester at the Rock');
                this.player1.triggerAbility('Lannisport');

                let event = this.player1.findCardByName('Without His Beard');
                expect(event.location).toBe('hand');
            });

            it('should prompt for the ability', function() {
                expect(this.player1).toAllowAbilityTrigger('Without His Beard');
            });
        });
    });
});
