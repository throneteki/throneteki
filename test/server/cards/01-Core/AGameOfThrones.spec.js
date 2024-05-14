describe('A Game Of Thrones', function () {
    integration(function () {
        describe('when dupes are put out in the setup phase', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', [
                    'A Noble Cause',
                    'A Game of Thrones',
                    'Wildling Scout',
                    'Stannis Baratheon (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.wildlingScout = this.player1.findCardByName('Wildling Scout', 'hand');
                this.character = this.player1.findCardByName('Stannis Baratheon', 'hand');

                this.player1.clickCard(this.wildlingScout);
                this.player1.clickCard(this.character);

                this.completeSetup();
                this.player1.selectPlot('A Game of Thrones');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            describe('when the player has not won an intrigue challenge', function () {
                it('should not allow military challenges to be declared', function () {
                    expect(this.player1).toHaveDisabledPromptButton('Military');
                });

                it('should not allow power challenges to be declared', function () {
                    expect(this.player1).toHaveDisabledPromptButton('Power');
                });
            });

            describe('when the player has won an intrigue challenge', function () {
                beforeEach(function () {
                    this.unopposedChallenge(this.player1, 'Intrigue', this.wildlingScout);
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should allow military challenges to be declared', function () {
                    expect(this.player1).toHavePromptButton('Military');
                });

                it('should allow power challenges to be declared', function () {
                    expect(this.player1).toHavePromptButton('Power');
                });
            });
        });
    });
});
