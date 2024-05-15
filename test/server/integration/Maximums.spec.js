describe('Maximums', function () {
    integration(function () {
        describe('event abilities', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', [
                    'A Game of Thrones',
                    'A Game of Thrones',
                    'A Meager Contribution',
                    'A Meager Contribution'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.skipSetupPhase();

                this.player1.selectPlot('A Game of Thrones');
                this.player2.selectPlot('A Game of Thrones');
                this.selectFirstPlayer(this.player2);
            });

            it('should not allow an event with a max to be prompted past the max', function () {
                this.player1.triggerAbility('A Meager Contribution');

                expect(this.player1).not.toAllowAbilityTrigger('A Meager Contribution');
            });

            it('should allow other players to play the event even if it reaches a maximum with another player', function () {
                this.player1.triggerAbility('A Meager Contribution');

                // Complete marshaling
                this.player2.clickPrompt('Done');

                expect(this.player2).toAllowAbilityTrigger('A Meager Contribution');
            });

            describe('when the maximum period has passed', function () {
                beforeEach(function () {
                    // Play the card Round 1
                    this.player1.triggerAbility('A Meager Contribution');
                    this.player2.clickPrompt('Done');
                    this.player2.clickPrompt('Pass');
                    this.player1.clickPrompt('Done');

                    this.completeChallengesPhase();

                    this.selectFirstPlayer(this.player2);
                });

                it('should allow the card to be prompted again', function () {
                    expect(this.player1).toAllowAbilityTrigger('A Meager Contribution');
                });
            });
        });

        describe('non-event abilities', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('greyjoy', [
                    'A Noble Cause',
                    'Hedge Knight',
                    'Hedge Knight',
                    'Drowned God Fanatic (SoKL)',
                    'Drowned God Fanatic (SoKL)'
                ]);
                const deck2 = this.buildDeck('greyjoy', ['A Noble Cause', 'Hedge Knight']);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                [this.fanatic1, this.fanatic2] = this.player1.filterCardsByName(
                    'Drowned God Fanatic',
                    'hand'
                );

                this.player1.dragCard(this.fanatic1, 'dead pile');
                this.player1.dragCard(this.fanatic2, 'dead pile');

                this.player1.clickCard('Hedge Knight', 'hand');
                this.player1.clickCard('Hedge Knight', 'hand');
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Put the first Fanatic into play
                this.player1.clickCard(this.fanatic1);
                this.player1.clickCard('Hedge Knight', 'play area');
            });

            it('should not allow the ability to be triggered past the max', function () {
                this.player1.clickCard(this.fanatic2);
                this.player1.clickCard('Hedge Knight', 'play area');

                expect(this.fanatic2.location).not.toBe('play area');
            });
        });
    });
});
