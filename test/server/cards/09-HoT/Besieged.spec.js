describe('Besieged', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('lannister', ['Besieged', 'A Noble Cause']);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();
        });

        describe('when Besieged is selected', function () {
            beforeEach(function () {
                this.player1.selectPlot('Besieged');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);
            });

            it('should set a minimum on both players', function () {
                expect(this.player1Object.defenderLimits.getMin()).toBe(1);
                expect(this.player2Object.defenderLimits.getMin()).toBe(1);
            });
        });

        describe('when double Besieged is selected', function () {
            beforeEach(function () {
                this.player1.selectPlot('Besieged');
                this.player2.selectPlot('Besieged');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.selectFirstPlayer(this.player1);
            });

            it('should properly reset the defender limit', function () {
                expect(this.player1Object.defenderLimits.getMin()).toBe(0);
                expect(this.player2Object.defenderLimits.getMin()).toBe(0);
            });
        });
    });
});
