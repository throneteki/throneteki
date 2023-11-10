describe('Dragonglass Dagger', function() {
    integration(function() {
        describe('vs Theon Greyjoy (TFoA)', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('thenightswatch', [
                    'A Noble Cause',
                    'Stonesnake', 'Dragonglass Dagger'
                ]);
                const deck2 = this.buildDeck('greyjoy', [
                    'A Noble Cause',
                    'Theon Greyjoy (TFoA)'
                ]);

                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Stonesnake', 'hand');
                this.attachment = this.player1.findCardByName('Dragonglass Dagger', 'hand');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.attachment);

                this.theon = this.player2.findCardByName('Theon Greyjoy', 'hand');
                this.player2.clickCard(this.theon);

                this.completeSetup();

                // Attach the dagger
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);

                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();
            });

            describe('when Theon is attacking alone', function() {
                beforeEach(function() {
                    this.player2.clickPrompt('Military');
                    this.player2.clickCard(this.theon);
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player1.clickCard(this.character);
                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();
                });

                it('should immunize the charcter with the dagger from Theon\'s effect', function() {
                    expect(this.player2).not.toHavePromptButton('Apply Claim');
                    // Challenge completed, kicked back to challenge declaration
                    expect(this.player2.currentPrompt().buttons.map(button => button.text)).toContain('Intrigue');
                });
            });
        });
    });
});
