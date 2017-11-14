describe('melee titles', function() {
    integration({ isMelee: true }, function() {
        describe('selecting titles', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'Trading with the Pentoshi',
                    'Hedge Knight'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.player3.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.completeSetup();

                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('Trading with the Pentoshi');
                this.player3.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player2);

                // Resolve plot order
                this.selectPlotOrder(this.player1);
                this.selectPlotOrder(this.player2);
            });

            it('should prompt players to select titles in first player order', function() {
                this.player2.selectTitle('Master of Coin');
                this.player3.selectTitle('Master of Laws');
                this.player1.selectTitle('Master of Ships');

                expect(this.player1Object.title.name).toBe('Master of Ships');
                expect(this.player2Object.title.name).toBe('Master of Coin');
                expect(this.player3Object.title.name).toBe('Master of Laws');
            });

            it('should remove previously chosen titles from the prompt', function() {
                this.player2.selectTitle('Master of Coin');
                this.player3.selectTitle('Master of Laws');

                expect(this.player1).toHavePrompt('Select a title');
                expect(this.player1).not.toHavePromptButton('Master of Coin');
                expect(this.player1).not.toHavePromptButton('Master of Laws');
            });
        });
    });
});
