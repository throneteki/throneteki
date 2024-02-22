describe('The Art of Seduction', function() {
    integration(function() {
        describe('when the next plot phase occurs', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'The Art of Seduction', 'A Noble Cause', 'Time of Plenty', 'Time of Plenty',
                    'Hedge Knight'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.completeSetup();

                this.player1.selectPlot('The Art of Seduction');
                this.player2.selectPlot('A Noble Cause');

                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();
                this.completeChallengesPhase();
            });

            it('does not allow the opponent to reveal a new plot card', function() {
                expect(this.player2).toHavePrompt('Waiting for opponent(s) to select plot');
            });

            describe('when the second plot phase occurs', function() {
                beforeEach(function() {
                    this.player1.selectPlot('A Noble Cause');

                    this.selectFirstPlayer(this.player1);
                    this.completeMarshalPhase();
                    this.completeChallengesPhase();
                });

                it('allow the opponent to reveal a new plot card', function() {
                    expect(this.player2).toHavePrompt('Select a plot');
                });
            });
        });

        describe('vs Wheels Within Wheels', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'The Art of Seduction', 'A Noble Cause', 'Time of Plenty', 'Time of Plenty',
                    'The Tickler', 'Wheels Within Wheels (TTWDFL)'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player2.clickCard('The Tickler', 'hand');

                this.completeSetup();

                this.player1.selectPlot('The Art of Seduction');
                this.player2.selectPlot('A Noble Cause');

                this.selectFirstPlayer(this.player2);
            });

            it('allows Wheels Within Wheels to be played', function() {
                this.player2.clickCard('Wheels Within Wheels', 'hand');
                this.player2.clickCard('The Tickler', 'play area');
                expect(this.player2).toHavePrompt('Select a plot');
            });
        });
    });
});
