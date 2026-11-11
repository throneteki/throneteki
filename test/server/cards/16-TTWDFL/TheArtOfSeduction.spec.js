describe('The Art of Seduction', function () {
    describe('when the next plot phase occurs', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck: ['The Art of Seduction', 'A Noble Cause', 'Time of Plenty'] },
                player2: { plotDeck: ['A Noble Cause', 'Time of Plenty', 'Time of Plenty'] }
            });
            this.player1.selectPlot('The Art of Seduction');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
            this.completeChallengesPhase();
        });

        it('does not allow the opponent to reveal a new plot card', function () {
            expect(this.player2).toHavePrompt('Waiting for opponent(s) to select plot');
        });

        it('allows the opponent to reveal a new plot card in the plot phase after that', function () {
            this.player1.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
            this.completeChallengesPhase();

            expect(this.player2).toHavePrompt('Select a plot');
        });
    });

    describe('vs Wheels Within Wheels', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck: ['The Art of Seduction', 'A Noble Cause'] },
                player2: {
                    plotDeck: ['A Noble Cause', 'Time of Plenty'],
                    inPlay: ['The Tickler'],
                    hand: ['Wheels Within Wheels (TTWDFL)']
                }
            });
            this.player1.selectPlot('The Art of Seduction');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player2);
        });

        it('allows Wheels Within Wheels to be played', function () {
            this.player2.clickCard(this.wheelsWithinWheels);
            this.player2.clickCard(this.theTickler);
            expect(this.player2).toHavePrompt('Select a plot');
        });
    });
});
