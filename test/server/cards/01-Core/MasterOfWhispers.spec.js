describe('Master of Whispers', function () {
    integration({ gameFormat: 'melee' }, function () {
        describe('applying intrigue claim', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Sansa Stark (Core)',
                    'Sansa Stark (Core)',
                    'Sansa Stark (Core)'
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

            it('should prompt to apply claim to additional players', function () {
                expect(this.player1).toHavePromptButton('player3');
            });

            it('should allow it to only be applied to the defending player', function () {
                this.player1.clickPrompt('Done');

                expect(this.player3Object.discardPile.length).toBe(0);
            });

            it('should apply it to selected players', function () {
                this.player1.clickPrompt('player3');

                expect(this.player2Object.discardPile.length).toBe(1);
                expect(this.player3Object.discardPile.length).toBe(1);
            });
        });

        describe('vs Trial by Combat', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Ser Jaime Lannister (Core)',
                    'Trial by Combat'
                ]);
                const opponentDeck = this.buildDeck('stark', ['A Noble Cause', 'Hedge Knight']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(opponentDeck);
                this.player3.selectDeck(opponentDeck);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Ser Jaime Lannister', 'hand');
                this.player2.clickCard('Hedge Knight', 'hand');
                this.player3.clickCard('Hedge Knight', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.selectTitle('Master of Whispers');
                this.player2.selectTitle('Master of Coin');
                this.player3.selectTitle('Master of Laws');

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickPrompt('player2');
                this.player1.clickCard('Ser Jaime Lannister', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Apply claim against both opponents
                this.player1.clickPrompt('Apply Claim');
                this.player1.clickPrompt('player3');

                // Trigger Trial by Combat
                this.player1.triggerAbility('Trial by Combat');
            });

            it('should require each chosen player to fulfill military claim', function () {
                this.player2.clickCard('Hedge Knight', 'play area');
                this.player3.clickCard('Hedge Knight', 'play area');

                expect(this.player2Object.deadPile.length).toBe(1);
                expect(this.player3Object.deadPile.length).toBe(1);
            });

            it('should not fulfill normal intrigue claim', function () {
                expect(this.player2Object.discardPile.length).toBe(0);
                expect(this.player3Object.discardPile.length).toBe(0);
            });
        });

        describe('vs Vengeance for Elia', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Ser Jaime Lannister (Core)',
                    'Hedge Knight',
                    'Hedge Knight'
                ]);
                const opponentDeck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Vengeance for Elia'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(opponentDeck);
                this.player3.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Ser Jaime Lannister', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.selectTitle('Master of Whispers');
                this.player2.selectTitle('Master of Coin');
                this.player3.selectTitle('Master of Laws');

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickPrompt('player2');
                this.player1.clickCard('Ser Jaime Lannister', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Apply claim against both opponents
                this.player1.clickPrompt('Apply Claim');
                this.player1.clickPrompt('player3');

                // Trigger Vengeance for Elia
                this.player2.triggerAbility('Vengeance for Elia');
                this.player2.clickPrompt('player1');
            });

            it('should apply claim to the additional opponents chosen', function () {
                expect(this.player3Object.discardPile.length).toBe(1);
            });

            it('should apply the normal effect for Vengeance for Elia', function () {
                expect(this.player1Object.discardPile.length).toBe(1);
            });
        });
    });
});
