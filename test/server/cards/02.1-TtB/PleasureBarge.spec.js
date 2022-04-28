describe('Pleasure Barge', function() {
    integration(function() {
        describe('gold modifier', function() {
            beforeEach(function() {
                const deck = this.buildDeck('Tyrell', [
                    'A Noble Cause',
                    'Pleasure Barge'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Pleasure Barge', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
            });

            it('reduces gold properly', function() {
                // 5 gold from plot - 1 gold from Pleasure Barge
                expect(this.player1Object.gold).toBe(4);
            });
        });

        describe('immunity vs card effects', function() {
            beforeEach(function() {
                const deck = this.buildDeck('Tyrell', [
                    'A Noble Cause', 'Political Disaster',
                    'Pleasure Barge', 'The Roseroad', 'Highgarden (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.pleasureBarge = this.player2.findCardByName('Pleasure Barge', 'hand');

                this.player2.clickCard(this.pleasureBarge);
                this.player2.clickCard('The Roseroad', 'hand');
                this.player2.clickCard('Highgarden', 'hand');

                this.completeSetup();

                this.player1.selectPlot('Political Disaster');
                this.player2.selectPlot('A Noble Cause');

                this.selectFirstPlayer(this.player2);

                // Select locations for Political Disaster
                this.player2.clickCard('The Roseroad', 'play area');
                this.player2.clickCard('Highgarden', 'play area');
                this.player2.clickPrompt('Done');
            });

            it('is not affected by card effects', function() {
                // Pleasure Barge is immune to all card effects, which means that
                // even though it wasn't chosen to be kept for Political Disaster,
                // it should not be discarded from play.
                expect(this.pleasureBarge.location).toBe('play area');
            });
        });
    });
});
