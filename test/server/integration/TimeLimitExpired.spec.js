describe('time limit', function() {
    integration(function() {
        describe('when a game has a time limit', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'Time of Plenty',
                    'Tycho Nestoris', 'Maester Cressen (Core)',
                    'Tycho Nestoris', 'Robert Baratheon (Core)',
                    'Ser Davos Seaworth (Core)', 'Bastard in Hiding',
                    'Advisor to the Crown', 'Advisor to the Crown',
                    'Advisor to the Crown', 'Advisor to the Crown',
                    'Advisor to the Crown', 'Advisor to the Crown',
                    'Advisor to the Crown', 'Advisor to the Crown'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.game.useGameTimeLimit = true;
                this.game.gameTimeLimit = 1;
                this.startGame();
                this.keepStartingHands();
            });

            it('the time limit does not start until the setup phase has finished', function() {
                expect(this.game.timeLimit.timeLimitStarted).toBe(false);
            });

            it('the time limit starts when the setup phase has finished', function() {
                this.completeSetup();
                expect(this.game.timeLimit.timeLimitStarted).toBe(true);
            });

            describe('the game correctly determines the winner', function() {
                beforeEach(function() {
                    expect(this.game.finishedAt).toBeUndefined();
                    expect(this.game.winner).toBeUndefined();
                    this.completeSetup();
                    this.selectFirstPlayer(this.player1);
                    this.completeMarshalPhase();
                    this.game.addPower(this.player1Object, 10);
                    this.game.addPower(this.player2Object, 10);
                    this.player1.clickPrompt('Done');
                });

                it('based on which player is closer to 15 power', function() {
                    this.game.addPower(this.player1Object, 1);
                    this.player2.clickPrompt('Done');
                    this.game.determineWinnerAfterTimeLimitExpired();
                    expect(this.game.finishedAt).toBeDefined();
                    expect(this.game.winner).toBe(this.player1Object);
                });

                it('based on which player has more cards left in his/her deck', function() {
                    this.player1Object.drawCardsToHand(1);
                    this.player2.clickPrompt('Done');
                    this.game.determineWinnerAfterTimeLimitExpired();
                    expect(this.game.finishedAt).toBeDefined();
                    expect(this.game.winner).toBe(this.player2Object);
                });

                it('based on which player won dominance in the last round', function() {
                    this.game.addGold(this.player2Object, 1);
                    this.game.addPower(this.player1Object, 1);
                    this.player2.clickPrompt('Done');
                    expect(this.game.winnerOfDominanceInLastRound).toBe(this.player2Object);
                    this.game.determineWinnerAfterTimeLimitExpired();
                    expect(this.game.finishedAt).toBeDefined();
                    expect(this.game.winner).toBe(this.player2Object);
                });

                it('based on which player has the fewest characters in his/her dead pile', function() {
                    this.deadCard = this.player1.findCardByName('Advisor to the Crown', 'hand');
                    this.player1Object.moveCard(this.deadCard, 'dead pile');
                    this.player2.clickPrompt('Done');
                    this.game.determineWinnerAfterTimeLimitExpired();
                    expect(this.game.finishedAt).toBeDefined();
                    expect(this.game.winner).toBe(this.player2Object);
                });
    
                it('based on which player was the first player in the last round', function() {
                    this.game.determineWinnerAfterTimeLimitExpired();
                    expect(this.game.finishedAt).toBeDefined();
                    expect(this.game.winner).toBe(this.player1Object);
                });
    
                it('when one player cannot win the game', function() {
                    this.tycho = this.player1.findCardByName('Tycho Nestoris');
                    this.player1Object.putIntoPlay(this.tycho);
                    this.game.addPower(this.player1Object, 1);
                    this.player2.clickPrompt('Done');
                    this.game.determineWinnerAfterTimeLimitExpired();
                    expect(this.game.finishedAt).toBeDefined();
                    expect(this.game.winner).toBe(this.player2Object);
                });
            });
        });
    });
});
