describe('ability limits', function () {
    integration(function () {
        describe('when an ability has a limit', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Robb Stark (Core)',
                    'Winterfell Steward',
                    'Winterfell Steward'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.character1, this.character2] = this.player1.filterCardsByName(
                    'Winterfell Steward',
                    'hand'
                );

                this.player1.clickCard('Robb Stark', 'hand');
                this.player1.clickCard(this.character1);
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.character1);

                // Kneel Robb
                this.player1.clickCard('Robb Stark', 'play area');

                // Manually kill a character
                this.player1.dragCard(this.character1, 'dead pile');
                this.player1.triggerAbility('Robb Stark');

                this.player1.clickCard('Robb Stark', 'play area');
            });

            it('should not allow the limit to be exceeded', function () {
                this.player1.dragCard(this.character2, 'dead pile');

                expect(this.player1).not.toAllowAbilityTrigger('Robb Stark');
            });
        });

        describe('when a limited ability is canceled', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('lannister', [
                    'A Noble Cause',
                    'Cersei Lannister (Core)',
                    'Treachery'
                ]);
                const deck2 = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Robb Stark (Core)',
                    'Winterfell Steward',
                    'Winterfell Steward'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                [this.character1, this.character2] = this.player2.filterCardsByName(
                    'Winterfell Steward',
                    'hand'
                );

                this.player1.clickCard('Cersei Lannister', 'hand');
                this.player2.clickCard('Robb Stark', 'hand');
                this.player2.clickCard(this.character1);
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.character2);

                // Kneel Robb
                this.player2.clickCard('Robb Stark', 'play area');

                // Manually kill a character
                this.player2.dragCard(this.character1, 'dead pile');
                this.player2.triggerAbility('Robb Stark');

                this.player1.triggerAbility('Treachery');
            });

            it('should not allow the ability to be triggered again', function () {
                this.player2.dragCard(this.character2, 'dead pile');

                expect(this.player2).not.toAllowAbilityTrigger('Robb Stark');
            });
        });
    });
});
