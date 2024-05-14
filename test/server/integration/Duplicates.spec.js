describe('Duplicates', function () {
    integration(function () {
        describe('automatic dupes', function () {
            describe('when a duped character you own would be killed after being stolen', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        'Sneak Attack',
                        'Valar Morghulis',
                        'Arya Stark (Core)',
                        'Arya Stark (Core)',
                        'Ward (TS)'
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    [this.character, this.dupe] = this.player1.filterCardsByName(
                        'Arya Stark',
                        'hand'
                    );
                    this.player1.clickCard(this.character);
                    this.player1.clickCard(this.dupe);

                    this.ward = this.player2.findCardByName('Ward', 'hand');

                    this.completeSetup();
                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    // Complete Player 1 marshalling
                    this.player1.clickPrompt('Done');

                    this.player2.clickCard(this.ward);
                    this.player2.clickCard(this.character);
                    this.player2.clickPrompt('Done');

                    this.completeChallengesPhase();

                    this.player1.selectPlot('Sneak Attack');
                    this.player2.selectPlot('Valar Morghulis');
                    this.selectFirstPlayer(this.player1);
                });

                it('should prompt to use the dupe on the controlled character', function () {
                    expect(this.player1).toAllowAbilityTrigger(this.dupe);
                });

                it('should not automatically kill the controlled character', function () {
                    expect(this.character.location).toBe('play area');
                });
            });
        });

        describe('manual dupes', function () {
            beforeEach(function () {
                this.player1.toggleManualDupes(true);
                this.player2.toggleManualDupes(true);
            });

            describe('when abilities cannot be triggered and a duped character would be killed', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'The King in the North (FotOG)',
                        'Hedge Knight',
                        'Arya Stark (Core)',
                        'Arya Stark (Core)'
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.player1.clickCard('Hedge Knight', 'hand');

                    [this.character, this.dupe] = this.player2.filterCardsByName(
                        'Arya Stark',
                        'hand'
                    );
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

                it('should allow the dupe to be used', function () {
                    expect(this.character.location).toBe('play area');
                    expect(this.dupe.location).toBe('discard pile');
                });
            });
        });
    });
});
