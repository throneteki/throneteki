describe('Retaliation', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('greyjoy', [
                'Retaliation', 'Retaliation', 'Sneak Attack', 'A Noble Cause', 'A Noble Cause'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.skipSetupPhase();
        });

        describe('when the player wins initiative', function() {
            beforeEach(function() {
                this.player1.selectPlot('Retaliation');
                this.player2.selectPlot('A Noble Cause');
            });

            it('should not allow the player to select themselves to be first player', function() {
                expect(this.player1).not.toHavePromptButton('player1');
                expect(this.player1).toHavePromptButton('player2');
            });
        });


        describe('when the player loses initiative', function() {
            beforeEach(function() {
                this.player1.selectPlot('Retaliation');
                this.player2.selectPlot('Sneak Attack');
            });

            it('should allow the opponent to select the player to be first player', function() {
                expect(this.player2).toHavePromptButton('player1');
                expect(this.player2).toHavePromptButton('player2');
            });
        });

        describe('when revealed two rounds in a row', function() {
            beforeEach(function() {
                this.player1.selectPlot('Retaliation');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.player1.selectPlot('Retaliation');
                this.player2.selectPlot('A Noble Cause');
            });

            it('should not allow the player to select themselves to be first player', function() {
                expect(this.player1).not.toHavePromptButton('player1');
                expect(this.player1).toHavePromptButton('player2');
            });
        });
    });
});
