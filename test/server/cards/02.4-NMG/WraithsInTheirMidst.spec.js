describe('WraithsInTheirMidst', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('greyjoy', [
                'Wraiths in Their Midst',
                'A Noble Cause',
                'Alannys Greyjoy (Core)'
            ]);
            const deck2 = this.buildDeck('lannister', [
                '"The Rains of Castamere"',
                'A Noble Cause',
                'A Feast for Crows',
                'Filthy Accusations',
                'Tywin Lannister (Core)'
            ]);
            this.player = this.player1Object;
            this.opponent = this.player2Object;

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Alannys Greyjoy', 'hand');
            this.player2.clickCard('Tywin Lannister', 'hand');
            this.completeSetup();

            this.nobleCause = this.player2.findCardByName('A Noble Cause');
            this.feastForCrows = this.player2.findCardByName('A Feast for Crows');
            this.filthyAccusations = this.player2.findCardByName('Filthy Accusations');
        });

        describe('when played against a plot that would not be reduced below 2', function () {
            beforeEach(function () {
                this.player1.selectPlot('Wraiths in Their Midst');
                this.player2.selectPlot(this.nobleCause);
                this.selectFirstPlayer(this.player1);
            });

            it('should reduce the reserve by the full amount', function () {
                // Reduce 6 reserve by 2 from plot, 1 by Alannys
                expect(this.player2Object.getReserve()).toBe(3);
            });
        });

        describe('when played against a plot that would be reduced below 2', function () {
            beforeEach(function () {
                this.player1.selectPlot('Wraiths in Their Midst');
                this.player2.selectPlot(this.feastForCrows);
                this.selectFirstPlayer(this.player1);
            });

            it('should reduce the reserve and cap at the 2 minimum', function () {
                // Reduce 4 reserve by 2 from plot, 1 by Alannys, min 2.
                expect(this.player2Object.getReserve()).toBe(2);
            });
        });

        describe('when Rains brings out a new plot', function () {
            beforeEach(function () {
                this.player1.selectPlot('Wraiths in Their Midst');
                this.player2.selectPlot(this.feastForCrows);
                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player2, 'intrigue', 'Tywin Lannister');

                this.player2.triggerAbility('"The Rains of Castamere"');
                this.player2.clickCard(this.filthyAccusations);
            });

            it('should reduce the new plot revealed', function () {
                // Reduce 6 by 2 from plot, 0 from Alannys since not first player
                expect(this.player2Object.getReserve()).toBe(4);
            });
        });

        describe('when a player reconnects after revealing Wraiths', function () {
            beforeEach(function () {
                this.player1.selectPlot('Wraiths in Their Midst');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                // Explicitly reconnect the player affected by Wraiths
                this.player2.reconnect();

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();
                this.completeChallengesPhase();
            });

            it('should not get a NaN reserve prompt', function () {
                expect(this.player2Object.getReserve()).toBe(4);
            });
        });
    });
});
