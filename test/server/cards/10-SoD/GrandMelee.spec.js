describe('Grand Melee', function() {
    integration(function() {
        describe('when removing a character from the challenge', function() {
            beforeEach(function() {
                const deck = this.buildDeck('tyrell', [
                    'Grand Melee', 'A Noble Cause',
                    'Garden Caretaker', 'Garden Caretaker', 'Renly Baratheon (FFH)', 'Highgarden (Core)'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.smallAttacker = this.player1.findCardByName('Garden Caretaker', 'hand');
                this.largeAttacker = this.player1.findCardByName('Renly Baratheon', 'hand');
                this.defenders = this.player2.filterCardsByName('Garden Caretaker', 'hand');

                this.player1.clickCard(this.smallAttacker);
                this.player1.clickCard(this.largeAttacker);

                for(let defender of this.defenders) {
                    this.player2.clickCard(defender);
                }
                this.player2.clickCard('Highgarden', 'hand');

                this.completeSetup();

                this.player1.selectPlot('Grand Melee');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.smallAttacker);
                this.player1.clickCard(this.largeAttacker);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                for(let defender of this.defenders) {
                    this.player2.clickCard(defender);
                }
                this.player2.clickPrompt('Done');

                // Remove the smaller character to ensure that the opponent does
                // not win with the remaining, stronger character.
                this.player2.clickMenu('Highgarden', 'Remove character from challenge');
                this.player2.clickCard(this.smallAttacker);
                expect(this.game.currentChallenge.attackers).not.toContain(this.smallAttacker);
            });

            it('should not count STR for characters participating alone', function() {
                expect(this.game.currentChallenge.attackerStrength).toBe(0);
                expect(this.game.currentChallenge.defenderStrength).toBe(2);
            });
        });
    });
});
