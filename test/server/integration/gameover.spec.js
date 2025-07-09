describe('Game Over', function () {
    integration({ gameFormat: 'joust', disableWinning: false }, function () {
        describe('Joust', function () {
            describe('when a single player reaches 15 power', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        'A Game of Thrones',
                        { name: 'Hedge Knight', count: 60 }
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.player1Object.faction.power = 14;

                    this.completeSetup();

                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('A Game of Thrones');

                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();
                    this.completeChallengesPhase();

                    // Player 1 wins dominance, as they have more gold
                });

                it('wins the game for that player', function () {
                    expect(this.game.results.winner).toBe(this.player1Object);
                });
            });

            describe('when both players reach 15 power simultaneously', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'Valar Morghulis',
                        'A Game of Thrones',
                        'Jon Arryn',
                        { name: 'Hedge Knight', count: 59 }
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.player1Object.faction.power = 14;
                    this.player2Object.faction.power = 14;

                    this.completeSetup();

                    this.player1.dragCard(this.player1.findCardByName('Jon Arryn'), 'play area');

                    this.player1.selectPlot('Valar Morghulis');
                    this.player2.selectPlot('A Game of Thrones');

                    this.selectFirstPlayer(this.player1);

                    this.player1.clickPrompt('Gain 1 power');
                    this.player2.clickPrompt('Gain 1 power');
                });

                it('allows the first player to choose the winner', function () {
                    expect(this.player1).toHavePrompt('Select next action');
                    this.player1.clickPrompt('player2 wins');

                    expect(this.game.results.winner).toBe(this.player2Object);
                });
            });

            describe('when a player is eliminated', function () {
                describe('by having no cards in their deck', function () {
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
                        this.startGame();
                        this.keepStartingHands();

                        this.completeSetup();

                        this.selectFirstPlayer(this.player1);
                    });

                    it('they are eliminated, and the other player wins', function () {
                        expect(this.player2Object.eliminated).toBe(true);
                        expect(this.game.results.winner).toBe(this.player1Object);
                    });
                });

                describe('by chess clock', function () {
                    beforeEach(function () {
                        const deck = this.buildDeck('stark', [
                            'A Noble Cause',
                            { name: 'Hedge Knight', count: 60 }
                        ]);
                        this.player1.selectDeck(deck);
                        this.player2.selectDeck(deck);
                        this.startGame();
                        this.keepStartingHands();

                        this.completeSetup();

                        this.selectFirstPlayer(this.player1);

                        // Simulate a chess clock ending trigger
                        this.game.chessClockExpired(this.player2Object);
                    });

                    it('they are eliminated, and the other player wins', function () {
                        expect(this.player2Object.eliminated).toBe(true);
                        expect(this.game.results.winner).toBe(this.player1Object);
                    });
                });
            });

            describe('when both players are eliminated simultaneously', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 9 }
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);
                });

                it('has the first player choose the winner', function () {
                    expect(this.player1).toHavePrompt('Select next action');
                    this.player1.clickPrompt('player1 is eliminated');

                    expect(this.game.results.winner).toBe(this.player2Object);
                });
            });

            describe('when the game goes to time', function () {
                beforeEach(function () {
                    this.triggerTimerGameEnd = () => {
                        this.game.timeLimitExpired();
                        this.completeRound();
                    };
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 60 }
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);
                });

                it('the player with more power wins', function () {
                    this.player1Object.faction.power = 5;
                    this.player2Object.faction.power = 4;
                    this.triggerTimerGameEnd();

                    expect(this.game.results.winner).toBe(this.player1Object);
                });

                describe('and power is tied', function () {
                    it('the player with more cards in deck wins', function () {
                        this.player1Object.moveCard(this.player1Object.drawDeck[0], 'hand');
                        this.triggerTimerGameEnd();

                        expect(this.game.results.winner).toBe(this.player2Object);
                    });

                    describe('and both players have the same number of cards in deck', function () {
                        it('the player who won dominance in the final round wins', function () {
                            this.game.winnerOfDominanceInLastRound = this.player2Object;
                            this.triggerTimerGameEnd();

                            expect(this.game.results.winner).toBe(this.player2Object);
                        });

                        describe('and no players won dominance in the final round', function () {
                            it('the player with fewest characters in their dead pile wins', function () {
                                this.player1Object.moveCard(
                                    this.player1Object.hand[0],
                                    'dead pile'
                                );
                                this.triggerTimerGameEnd();

                                expect(this.game.results.winner).toBe(this.player2Object);
                            });

                            describe('and both players have the same number of characters in their dead pile', function () {
                                it('the first player in the final round wins', function () {
                                    // Player 1 was set as first player at start of round
                                    this.triggerTimerGameEnd();

                                    expect(this.game.results.winner).toBe(this.player1Object);
                                });
                            });
                        });
                    });
                });

                describe('and both players cannot win', function () {
                    beforeEach(function () {
                        this.player1Object.cannotWinGame = true;
                        this.player2Object.cannotWinGame = true;

                        this.triggerTimerGameEnd();
                    });

                    it('nobody wins', function () {
                        expect(this.game.results.winner).toBeUndefined();
                    });
                });
            });
        });
    });
    integration({ gameFormat: 'melee', disableWinning: false }, function () {
        describe('Melee', function () {
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

                    this.player1Object.faction.power = 14;
                    this.player2Object.faction.power = 5;
                    this.player3Object.faction.power = 10;

                    this.completeSetup();

                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('A Game of Thrones');
                    this.player3.selectPlot('A Game of Thrones');

                    this.selectFirstPlayer(this.player1);

                    this.player1.selectTitle('Master of Whispers');
                    this.player2.selectTitle('Hand of the King');
                    this.player3.selectTitle('Master of Ships');

                    this.completeMarshalPhase();
                    this.completeChallengesPhase();
                });

                it('they win the game', function () {
                    expect(this.game.results.winner).toBe(this.player1Object);
                });

                it('other remaining players are ranked by power total', function () {
                    expect(this.player1Object.standing).toBe(1);
                    expect(this.player3Object.standing).toBe(2);
                    expect(this.player2Object.standing).toBe(3);
                });
            });

            describe('when multiple players reach 15 power simultaneously', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        'Valar Morghulis',
                        'Jon Arryn',
                        { name: 'Hedge Knight', count: 60 }
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.player3.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.player1Object.faction.power = 14;
                    this.player2Object.faction.power = 14;
                    this.player3Object.faction.power = 10;

                    this.completeSetup();

                    this.player1.dragCard(this.player1.findCardByName('Jon Arryn'), 'play area');

                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('A Noble Cause');
                    this.player3.selectPlot('Valar Morghulis');

                    this.selectFirstPlayer(this.player1);

                    this.player1.clickPrompt('Gain 1 power');
                    this.player2.clickPrompt('Gain 1 power');
                    this.player3.clickPrompt('Draw 2 cards');
                });

                it('allows the first player to choose the winner', function () {
                    expect(this.player1).toHavePrompt('Select next action');
                    this.player1.clickPrompt('player2 wins');

                    expect(this.game.results.winner).toBe(this.player2Object);
                });

                it('other remaining players are ranked by total power', function () {
                    this.player1.clickPrompt('player2 wins');

                    expect(this.player2Object.standing).toBe(1);
                    expect(this.player1Object.standing).toBe(2);
                    expect(this.player3Object.standing).toBe(3);
                });
            });

            describe('when a player is eliminated', function () {
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

                    this.ownedCard = this.player3.findCardByName('Hedge Knight');
                    this.player3.dragCard(this.ownedCard, 'play area');
                    this.controlledCard = this.player2.findCardByName('Hedge Knight');
                    this.player2.dragCard(this.controlledCard, 'play area');
                    this.controlledCard.takeControl(this.player3Object);

                    this.selectFirstPlayer(this.player1);

                    this.player1.selectTitle('Master of Whispers');
                    this.player2.selectTitle('Hand of the King');
                    this.player3.selectTitle('Master of Ships');
                });

                it('should place them in the next available standing', function () {
                    expect(this.player3Object.standing).toBe(3);
                });

                it('if there are remaining players, the game continues', function () {
                    expect(this.game.getNumberOfPlayers()).toBe(2);
                    expect(this.game.isGameOver).toBe(false);
                });

                it('all cards they own in play should be removed from the game', function () {
                    expect(this.ownedCard.location).toBe('out of game');
                });

                it('all cards they control (and do not own) in play should be discarded', function () {
                    expect(this.controlledCard.location).toBe('discard pile');
                    expect(this.controlledCard.controller).toBe(this.player2Object);
                });
            });

            describe('when a player is simultanously eliminated and winning the game', function () {
                beforeEach(function () {
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        { name: 'Oldtown', count: 10 }
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.player3.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();

                    this.oldtown = this.player2.findCardByName('Oldtown', 'hand');
                    this.player2.dragCard(this.oldtown, 'play area');
                    this.player2Object.faction.power = 14;

                    this.selectFirstPlayer(this.player1);

                    this.player1.selectTitle('Master of Whispers');
                    this.player2.selectTitle('Hand of the King');
                    this.player3.selectTitle('Master of Ships');
                });

                it('allows the first player to choose whether they are eliminated or win the game', function () {
                    this.player2.clickMenu(this.oldtown, 'Reveal top card of deck');
                    this.player2.clickPrompt('Location');

                    expect(this.player1).toHavePrompt('Select next action');
                    expect(this.player1).toHavePromptButton('player2 is eliminated');
                    expect(this.player1).toHavePromptButton('player2 wins');
                });
            });

            describe('when multiple players are eliminated simultaneously', function () {
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
                    this.player3.selectDeck(losingDeck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);

                    this.player1.selectTitle('Master of Whispers');
                    this.player2.selectTitle('Hand of the King');
                    this.player3.selectTitle('Master of Ships');
                });

                it('the first player chooses the order of elimination', function () {
                    expect(this.player1).toHavePrompt('Select next action');
                    this.player1.clickPrompt('player2 is eliminated');

                    expect(this.player2Object.standing).toBe(3);
                    expect(this.player3Object.standing).toBe(2);
                });
            });

            describe('when the game goes to time', function () {
                beforeEach(function () {
                    this.triggerTimerGameEnd = () => {
                        this.game.timeLimitExpired();
                        this.completeRound();
                    };
                    const deck = this.buildDeck('stark', [
                        'A Noble Cause',
                        { name: 'Hedge Knight', count: 60 }
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.player3.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);

                    this.player1.selectTitle('Master of Whispers');
                    this.player2.selectTitle('Hand of the King');
                    this.player3.selectTitle('Master of Ships');
                });

                it('the player with the most power wins', function () {
                    this.player1Object.faction.power = 5;
                    this.player2Object.faction.power = 4;
                    this.player3Object.faction.power = 3;
                    this.triggerTimerGameEnd();

                    expect(this.game.results.winner).toBe(this.player1Object);
                });

                describe('and power is tied between multiple players', function () {
                    beforeEach(function () {
                        this.player1Object.faction.power = 5;
                        this.player2Object.faction.power = 5;
                        this.player3Object.faction.power = 1;
                    });
                    describe('and multiple winners are allowed', function () {
                        beforeEach(function () {
                            this.game.allowMultipleWinners = true;
                            this.triggerTimerGameEnd();
                        });

                        it('those players win the game', function () {
                            expect(this.game.results.winner).toContain(this.player1Object);
                            expect(this.game.results.winner).toContain(this.player2Object);
                        });

                        it('the remaining players standings are adjusted to account for those winners', function () {
                            expect(this.player1Object.standing).toBe(1);
                            expect(this.player2Object.standing).toBe(1);
                            expect(this.player3Object.standing).toBe(3);
                        });
                    });
                    describe('and a single winner is required', function () {
                        beforeEach(function () {
                            this.game.allowMultipleWinners = false;
                        });

                        it('the player with the most cards in their deck wins', function () {
                            this.player1Object.moveCard(this.player1Object.drawDeck[0], 'hand');
                            this.triggerTimerGameEnd();

                            expect(this.game.results.winner).toBe(this.player2Object);
                        });

                        describe('and players have the same number of cards in deck', function () {
                            it('the player who won dominance in the final round wins', function () {
                                this.game.winnerOfDominanceInLastRound = this.player2Object;
                                this.triggerTimerGameEnd();

                                expect(this.game.results.winner).toBe(this.player2Object);
                            });

                            describe('and no players won dominance in the final round', function () {
                                it('the player with fewest characters in their dead pile wins', function () {
                                    this.player2Object.moveCard(
                                        this.player2Object.hand[0],
                                        'dead pile'
                                    );
                                    this.triggerTimerGameEnd();

                                    expect(this.game.results.winner).toBe(this.player1Object);
                                });

                                describe('and players have the same number of characters in their dead pile', function () {
                                    it('the one who was first player in the final round wins', function () {
                                        // Player 1 was set as first player at start of round
                                        this.triggerTimerGameEnd();

                                        expect(this.game.results.winner).toBe(this.player1Object);
                                    });

                                    // Note: This is a community made rule, as FFG has no ruling for this rare scenario
                                    describe('and none of those players were first player in the final round', function () {
                                        it('the player closest to first wins', function () {
                                            this.game.setFirstPlayer(this.player3Object);
                                            // Need to manually click marshaling prompts in old first player order
                                            this.player1.clickPrompt('Done');
                                            this.player2.clickPrompt('Done');
                                            this.player3.clickPrompt('Done');
                                            this.triggerTimerGameEnd();

                                            expect(this.game.results.winner).toBe(
                                                this.player1Object
                                            );
                                        });
                                    });
                                });
                            });
                        });

                        describe('and those players cannot win', function () {
                            beforeEach(function () {
                                this.player1Object.cannotWinGame = true;
                                this.player2Object.cannotWinGame = true;

                                this.triggerTimerGameEnd();
                            });

                            it('the next highest power total player wins', function () {
                                expect(this.game.results.winner).toBe(this.player3Object);
                            });

                            it('those players will be placed 2nd', function () {
                                expect(this.player1Object.standing).toBe(2);
                                expect(this.player2Object.standing).toBe(2);
                                expect(this.player3Object.standing).toBe(1);
                            });
                        });
                    });
                });

                describe('and all players cannot win', function () {
                    beforeEach(function () {
                        this.player1Object.cannotWinGame = true;
                        this.player2Object.cannotWinGame = true;
                        this.player3Object.cannotWinGame = true;

                        this.triggerTimerGameEnd();
                    });

                    it('nobody wins', function () {
                        expect(this.game.results.winner).toBeUndefined();
                    });
                });
            });
        });
    });
});
