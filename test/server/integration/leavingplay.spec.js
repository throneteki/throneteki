describe('leaving play', function () {
    integration(function () {
        describe('when a lasting effect has been applied to the card', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('thenightswatch', [
                    'Trading with the Pentoshi',
                    'Old Bear Mormont (Core)'
                ]);
                const deck2 = this.buildDeck('baratheon', [
                    'Trading with the Pentoshi',
                    'Drogon (Core)',
                    'Dracarys!'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Old Bear Mormont', 'hand');

                this.player1.clickCard(this.character);
                this.player2.clickCard('Drogon', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');

                this.player1.clickPrompt('Pass');
                this.player2.clickCard('Dracarys!');
                this.player2.clickCard('Drogon', 'play area');
                this.player2.clickCard(this.character);

                expect(this.character.getStrength()).toBe(2);

                this.player1.dragCard(this.character, 'hand');
                this.player1.dragCard(this.character, 'play area');
            });

            it('should reset the lasting effect', function () {
                expect(this.character.getStrength()).toBe(6);
            });
        });

        describe('when there is a cancel interrupt to the card leaving play', function () {
            beforeEach(function () {
                const deck = this.buildDeck('thenightswatch', [
                    'A Game of Thrones',
                    'Political Disaster',
                    'The Wall (Core)',
                    'Improved Fortifications'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.location = this.player1.findCardByName('The Wall', 'hand');
                this.attachment = this.player1.findCardByName('Improved Fortifications', 'hand');

                this.player1.clickCard(this.location);
                this.player1.clickCard(this.attachment);

                this.completeSetup();

                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.location);

                this.player1.selectPlot('Political Disaster');
                this.player2.selectPlot('A Game of Thrones');

                this.selectFirstPlayer(this.player1);

                // Do not select the location to be saved from Political Disaster
                this.player1.clickPrompt('Done');

                // Player 2 does not have any locations so no action is taken
            });

            it('should prompt to use the interrupt and not have the card leave play immediately', function () {
                expect(this.player1).toAllowAbilityTrigger('Improved Fortifications');
                expect(this.location.location).toBe('play area');
                expect(this.player1Object.cardsInPlay).toContain(this.location);
            });

            it('should stop the card from leaving play once the ability is triggered', function () {
                this.player1.triggerAbility('Improved Fortifications');
                expect(this.location.location).toBe('play area');
                expect(this.player1Object.cardsInPlay).toContain(this.location);
                expect(this.attachment.location).toBe('discard pile');
            });
        });

        describe('when a card ability limit has been reached', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', [
                    'Trading with the Pentoshi',
                    'Melisandre (Core)',
                    'Dragonstone Faithful',
                    'Dragonstone Faithful'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Melisandre', 'hand');
                [this.chud1, this.chud2] = this.player2.filterCardsByName(
                    'Dragonstone Faithful',
                    'hand'
                );

                this.player2.clickCard(this.chud1);
                this.player2.clickCard(this.chud2);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.player1.clickCard(this.character);
                this.player1.triggerAbility('Melisandre');
                this.player1.clickCard(this.chud1);

                this.player1.dragCard(this.character, 'hand');
                this.player1.clickCard(this.character);
            });

            it('should reset after leaving play', function () {
                expect(this.player1).toAllowAbilityTrigger('Melisandre');
            });
        });
    });
});
