describe('Winning and losing', function () {
    integration({ gameFormat: 'melee', disableWinning: false }, function () {
        describe('losing the game', function () {
            describe('when a player draws their last card', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 60 }
                    ]);
                    const losingDeck = this.buildDeck('stark', [
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 9 }
                    ]);

                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.player3.selectDeck(losingDeck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);

                    this.player1.selectTitle('Master of Ships');
                    this.player2.selectTitle('Master of Coin');
                    this.player3.selectTitle('Master of Laws');
                });

                it('eliminates the player', function () {
                    expect(this.player3Object.eliminated).toBe(true);
                });

                it('does not prompt eliminated players further', function () {
                    this.player1.clickPrompt('Done');
                    this.player2.clickPrompt('Done');

                    expect(this.player3).not.toHavePrompt('Marshal your cards');
                    // Player 1's turn on the challenges phase
                    expect(this.player1).toHaveDisabledPromptButton('Military');
                });
            });

            describe('when the first player draws their last card', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 60 }
                    ]);
                    const losingDeck = this.buildDeck('stark', [
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 9 }
                    ]);

                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(losingDeck);
                    this.player3.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();

                    this.selectFirstPlayer(this.player2);

                    this.player2.selectTitle('Master of Coin');
                    this.player3.selectTitle('Master of Laws');
                    this.player1.selectTitle('Master of Ships');
                });

                it('the next clockwise player becomes first player', function () {
                    expect(this.player2Object.firstPlayer).toBe(false);
                    expect(this.player3Object.firstPlayer).toBe(true);
                    expect(this.game.getFirstPlayer()).toBe(this.player3Object);
                });
            });

            describe('when all but one player draws their last card', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 60 }
                    ]);
                    const losingDeck = this.buildDeck('stark', [
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 9 }
                    ]);

                    this.player1.selectDeck(losingDeck);
                    this.player2.selectDeck(deck);
                    this.player3.selectDeck(losingDeck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);

                    this.player1.selectTitle('Master of Ships');
                    this.player2.selectTitle('Master of Coin');
                    this.player3.selectTitle('Master of Laws');
                });

                it('the remaining player wins the game', function () {
                    expect(this.game.winner).toBe(this.player2Object);
                });
            });

            describe('when all players draw their last card', function () {
                beforeEach(function () {
                    const losingDeck = this.buildDeck('stark', [
                        'A Noble Cause',
                        'A Noble Cause',
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 9 }
                    ]);
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        'A Noble Cause',
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 11 }
                    ]);

                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(losingDeck);
                    this.player3.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();

                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('A Noble Cause');
                    this.player3.selectPlot('A Noble Cause');

                    this.selectFirstPlayer(this.player1);

                    this.player1.selectTitle('Master of Ships');
                    this.player2.selectTitle('Master of Coin');
                    this.player3.selectTitle('Master of Laws');

                    // Player 2 is eliminated early
                    expect(this.player2Object.eliminated).toBe(true);

                    this.completeMarshalPhase();
                    this.completeChallengesPhase();
                    this.completeTaxationPhase();

                    this.player1.selectPlot('A Noble Cause');
                    this.player3.selectPlot('A Noble Cause');

                    this.selectFirstPlayer(this.player1);

                    this.player1.selectTitle('Master of Ships');
                    this.player3.selectTitle('Master of Laws');
                });

                it('has the first player choose the winner', function () {
                    expect(this.player1).toHavePrompt('Select the winning player');
                    this.player1.clickPrompt('player3');

                    expect(this.game.winner).toBe(this.player3Object);
                });
            });
        });

        describe('winning the game', function () {
            describe('when a single player reaches 15 power', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        'A Game of Thrones',
                        { name: 'Hedge Knight', count: 60 }
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.player3.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();

                    // Set player 1 to 14 power and select plot that will give them gold to win dominance
                    this.player1Object.faction.power = 14;
                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('A Game of Thrones');
                    this.player3.selectPlot('A Game of Thrones');

                    this.selectFirstPlayer(this.player1);

                    this.player1.selectTitle('Master of Ships');
                    this.player2.selectTitle('Master of Whispers');
                    this.player3.selectTitle('Master of Laws');

                    this.completeMarshalPhase();
                    this.completeChallengesPhase();
                });

                it('wins the game for that player', function () {
                    expect(this.game.winner).toBe(this.player1Object);
                });
            });

            describe('when a multiple players reach 15 power simultaneously', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'Valar Morghulis',
                        'A Noble Cause',
                        { name: 'Jon Arryn', count: 60 }
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.player3.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.player1.clickCard('Jon Arryn', 'hand');
                    this.completeSetup();

                    this.player1Object.faction.power = 14;
                    this.player3Object.faction.power = 14;
                    this.player1.selectPlot('Valar Morghulis');
                    this.player2.selectPlot('A Noble Cause');
                    this.player3.selectPlot('A Noble Cause');

                    this.selectFirstPlayer(this.player2);

                    this.player2.clickPrompt('Draw 2 cards');
                    this.player3.clickPrompt('Gain 1 power');
                    this.player1.clickPrompt('Gain 1 power');
                });

                it('wins the game for that player', function () {
                    expect(this.player2).toHavePrompt('Select the winning player');
                    this.player2.clickPrompt('player3');

                    expect(this.game.winner).toBe(this.player3Object);
                });
            });
        });
    });
});
