describe('Khal Drogo (Core)', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('targaryen', [
                'A Noble Cause',
                'A Noble Cause',
                'Khal Drogo (Core)',
                'Braided Warrior'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Khal Drogo', 'hand');
            this.player1.clickCard('Braided Warrior', 'hand');
            this.completeSetup();
            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
        });

        describe('after initiating a military challenge', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard('Khal Drogo', 'play area');
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                // Skip claim
                this.player1.clickPrompt('Continue');
            });

            it('should allow another military challenge to be initiated', function () {
                expect(this.player1).toHavePromptButton('Military');
            });

            describe('after using the second challenge', function () {
                beforeEach(function () {
                    // Restand Drogo
                    this.player1.clickCard('Khal Drogo', 'play area');

                    // Second Military
                    this.player1.clickPrompt('Military');
                    this.player1.clickCard('Khal Drogo', 'play area');
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();
                    // Skip claim
                    this.player1.clickPrompt('Continue');

                    // Go to the next round
                    this.completeChallengesPhase();
                    this.selectFirstPlayer(this.player1);
                    this.completeMarshalPhase();

                    // First military challenge of the second round
                    this.player1.clickPrompt('Military');
                    this.player1.clickCard('Khal Drogo', 'play area');
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();
                    // Skip claim
                    this.player1.clickPrompt('Continue');
                });

                it('should still allow both military challenges in the next round', function () {
                    expect(this.player1).toHavePromptButton('Military');
                });
            });
        });
    });
});
