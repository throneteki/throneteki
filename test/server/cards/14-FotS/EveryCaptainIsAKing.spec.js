describe('Every Captain is a King', function () {
    integration(function () {
        describe('when declared in a power challenge', function () {
            beforeEach(function () {
                const deck = this.buildDeck('greyjoy', [
                    'Sailing the Summer Sea',
                    'The Drumm',
                    'Every Captain is a King'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.captain = this.player1.findCardByName('The Drumm', 'hand');
                this.player1.clickCard(this.captain);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickCard('Every Captain is a King', 'hand');

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.captain);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');
            });

            it('does not kneel the captin', function () {
                expect(this.captain.kneeled).toBe(false);
            });

            it('does not kneel the captain for a second challenge', function () {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.captain);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');

                expect(this.captain.kneeled).toBe(false);
            });
        });
    });
});
