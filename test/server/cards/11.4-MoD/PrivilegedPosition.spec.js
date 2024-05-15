describe('Privileged Position', function () {
    integration(function () {
        describe('after losing a power challenge the previous round', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', [
                    'A Noble Cause',
                    'A Noble Cause',
                    'Privileged Position',
                    'Dragonstone Faithful',
                    'Dragonstone Port'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.event = this.player1.findCardByName('Privileged Position', 'hand');
                this.character = this.player2.findCardByName('Dragonstone Faithful', 'hand');
                this.location = this.player2.findCardByName('Dragonstone Port', 'hand');

                this.player2.clickCard(this.character);
                this.player2.clickCard(this.location);

                this.completeSetup();

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Done');
                this.unopposedChallenge(this.player2, 'Power', this.character);
                this.player2.clickPrompt('Apply Claim');

                this.player2.clickPrompt('Done');

                this.selectFirstPlayer(this.player1);

                this.player1.clickPrompt('Done');

                // Activate reducer card
                this.player2.clickCard(this.location);
            });

            it('prompts to cancel', function () {
                expect(this.player1).toAllowAbilityTrigger(this.event);
            });
        });
    });
});
