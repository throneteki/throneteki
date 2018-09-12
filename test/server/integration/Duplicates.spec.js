describe('Duplicates', function() {
    integration(function() {
        describe('manual dupes', function() {
            beforeEach(function() {
                this.player1.toggleManualDupes(true);
                this.player2.toggleManualDupes(true);
            });

            describe('when abilities cannot be triggered and a duped character would be killed', function() {
                beforeEach(function() {
                    const deck = this.buildDeck('stark', [
                        'The King in the North',
                        'Hedge Knight', 'Arya Stark (Core)', 'Arya Stark (Core)'
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.player1.clickCard('Hedge Knight', 'hand');

                    [this.character, this.dupe] = this.player2.filterCardsByName('Arya Stark', 'hand');
                    this.player2.clickCard(this.character);
                    this.player2.clickCard(this.dupe);

                    this.completeSetup();
                    this.selectFirstPlayer(this.player1);
                    this.completeMarshalPhase();

                    this.unopposedChallenge(this.player1, 'Military', 'Hedge Knight');
                    this.player1.clickPrompt('Apply Claim');

                    this.player2.clickCard(this.character);

                    expect(this.player2).toAllowAbilityTrigger(this.dupe);

                    this.player2.clickCard(this.dupe);
                });

                it('should allow the dupe to be used', function() {
                    expect(this.character.location).toBe('play area');
                    expect(this.dupe.location).toBe('discard pile');
                });
            });
        });
    });
});
