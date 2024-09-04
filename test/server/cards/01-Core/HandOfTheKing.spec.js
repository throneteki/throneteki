describe('Hand of the King', function () {
    integration({ isMelee: true }, function () {
        describe('initiating additional power challenge', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Bastard in Hiding',
                    'Shireen Baratheon (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.player3.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Bastard in Hiding', 'hand');
                this.player1.clickCard('Shireen Baratheon (Core)', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.selectTitle('Hand of the King');
                this.player2.selectTitle('Master of Coin');
                this.player3.selectTitle('Master of Ships');

                this.completeMarshalPhase();

                // Power challenge vs player2
                this.player1.clickPrompt('Power');
                this.player1.clickPrompt('player2');
                this.player1.clickCard('Bastard in Hiding');
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');

                // Additional power challenge
                this.player1.clickPrompt('Power');
            });

            it('should allow an additional challenge against the other player', function () {
                expect(this.player1).toHaveDisabledPromptButton('player2');
                expect(this.player1).toHavePromptButton('player3');
            });
        });

        describe('when the player already has an additional power challenge', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'Sailing the Summer Sea',
                    'Bastard in Hiding',
                    'Bastard in Hiding',
                    'Shireen Baratheon (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.player3.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Bastard in Hiding', 'hand');
                this.player1.clickCard('Bastard in Hiding', 'hand');
                this.player1.clickCard('Shireen Baratheon (Core)', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.selectTitle('Hand of the King');
                this.player2.selectTitle('Master of Coin');
                this.player3.selectTitle('Master of Ships');

                this.completeMarshalPhase();

                // Power challenge vs player2
                this.player1.clickPrompt('Power');
                this.player1.clickPrompt('player2');
                this.player1.clickCard('Bastard in Hiding');
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');

                // Additional power challenge
                this.player1.clickPrompt('Power');
            });

            it('should not limit the opponent for the second challenge', function () {
                expect(this.player1).toHavePromptButton('player2');
            });

            it('should limit the opponent for the third challenge', function () {
                // Power challenge #2 vs player 2
                this.player1.clickPrompt('player2');
                this.player1.clickCard('Shireen Baratheon (Core)');
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');

                // Power challenge #3
                this.player1.clickPrompt('Power');

                expect(this.player1).toHaveDisabledPromptButton('player2');
            });

            it('should not limit the opponent for the third challenge if second challenge opponent was different', function () {
                // Power challenge vs player 3
                this.player1.clickPrompt('player3');
                this.player1.clickCard('Shireen Baratheon (Core)');
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player3.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');

                // Power challenge #3
                this.player1.clickPrompt('Power');

                expect(this.player1).toHavePromptButton('player2');
            });
        });
    });
});
