describe('The Lord of the Crossing', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('baratheon', [
                'The Lord of the Crossing',
                'A Noble Cause',
                'Blood of the Dragon',
                'Selyse Baratheon (Core)',
                'Bastard in Hiding',
                'Fiery Followers'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.selyse = this.player1.findCardByName('Selyse Baratheon', 'hand');
            this.bastard = this.player1.findCardByName('Bastard in Hiding', 'hand');
            this.followers = this.player1.findCardByName('Fiery Followers', 'hand');

            this.player1.clickCard(this.selyse);
            this.player1.clickCard(this.bastard);
            this.player1.clickCard(this.followers);

            this.completeSetup();
        });

        describe('on challenge 1', function () {
            beforeEach(function () {
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.followers);
                this.player1.clickPrompt('Done');
            });

            it('should reduce the strength of attacking characters by 1', function () {
                expect(this.followers.getStrength()).toBe(1);
            });

            it('should calculate overall strength correctly upon declaration', function () {
                expect(this.game.currentChallenge.attackerStrength).toBe(1);
            });

            it('should have the correct strength at the end of the challenge', function () {
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();

                expect(this.followers.getStrength()).toBe(1);
                expect(this.game.currentChallenge.attackerStrength).toBe(1);
                expect(this.game.currentChallenge.winnerStrength).toBe(1);
            });

            it('should reset the character strength after the challenge', function () {
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickPrompt('Done');

                expect(this.followers.getStrength()).toBe(2);
            });
        });

        describe('on challenge 2', function () {
            beforeEach(function () {
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.followers);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.selyse);
                this.player1.clickPrompt('Done');
            });

            it('should not modify the strength of attacking characters', function () {
                expect(this.selyse.getStrength()).toBe(2);
            });

            it('should calculate overall strength correctly upon declaration', function () {
                expect(this.game.currentChallenge.attackerStrength).toBe(2);
            });

            it('should have the correct strength at the end of the challenge', function () {
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();

                expect(this.game.currentChallenge.attackerStrength).toBe(2);
                expect(this.game.currentChallenge.winnerStrength).toBe(2);
            });
        });

        describe('on challenge 3', function () {
            beforeEach(function () {
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.followers);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.selyse);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.bastard);
                this.player1.clickPrompt('Done');
            });

            it('should increase the strength of attacking characters by 2', function () {
                expect(this.bastard.getStrength()).toBe(4);
            });

            it('should calculate overall strength correctly upon declaration', function () {
                expect(this.game.currentChallenge.attackerStrength).toBe(4);
            });

            it('should have the correct strength at the end of the challenge', function () {
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();

                expect(this.game.currentChallenge.attackerStrength).toBe(4);
                expect(this.game.currentChallenge.winnerStrength).toBe(4);
            });

            describe('when the player wins', function () {
                beforeEach(function () {
                    this.skipActionWindow();
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();
                });

                it('should grant power when the won', function () {
                    // 3 from unopposed challenges, 1 from LotC
                    expect(this.player1Object.getTotalPower()).toBe(4);
                });
            });
        });

        describe('when Blood of the Dragon is in play', function () {
            beforeEach(function () {
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('Blood of the Dragon');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.selyse);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.followers);
                this.player1.clickPrompt('Done');
            });

            it('should not apply the -1 STR penalty from the first challenge and kill the character', function () {
                expect(this.followers.location).not.toBe('dead pile');
            });
        });
    });

    integration(function () {
        describe('vs Jon Snow (Core)', function () {
            beforeEach(function () {
                const deck = this.buildDeck('thenightswatch', [
                    'The Lord of the Crossing',
                    'A Noble Cause',
                    'Jon Snow (Core)',
                    'Steward at the Wall'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.jon = this.player1.findCardByName('Jon Snow', 'hand');
                this.steward = this.player1.findCardByName('Steward at the Wall', 'hand');

                this.player1.clickCard(this.jon);
                this.player1.clickCard(this.steward);

                this.completeSetup();
            });

            describe('when Jon Snow becomes an attacker through his ability', function () {
                beforeEach(function () {
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();

                    this.player1.clickPrompt('Intrigue');
                    this.player1.clickCard(this.steward);
                    this.player1.clickPrompt('Done');
                });

                it("should reduce Jon Snow's strength", function () {
                    expect(this.jon.getStrength()).toBe(3);
                });
            });
        });
    });

    integration(function () {
        describe('vs Randyll Tarly', function () {
            beforeEach(function () {
                const deck = this.buildDeck('tyrell', [
                    'The Lord of the Crossing',
                    'A Noble Cause',
                    'Randyll Tarly (Core)',
                    'Garden Caretaker',
                    'Steward at the Wall'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.randyll = this.player1.findCardByName('Randyll Tarly', 'hand');
                this.powerchud = this.player1.findCardByName('Garden Caretaker', 'hand');
                this.intriguechud = this.player1.findCardByName('Steward at the Wall', 'hand');

                this.player1.clickCard(this.randyll);
                this.player1.clickCard(this.powerchud);
                this.player1.clickCard(this.intriguechud);

                this.completeSetup();
            });

            describe('when Randyll Tarly attacks in the third challenge', function () {
                beforeEach(function () {
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();

                    this.player1.clickPrompt('Intrigue');
                    this.player1.clickCard(this.intriguechud);
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();

                    this.player1.clickPrompt('Power');
                    this.player1.clickCard(this.powerchud);
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player1.clickPrompt('Apply Claim');

                    this.player1.clickPrompt('Military');
                    this.player1.clickCard(this.randyll);
                    this.player1.clickPrompt('Done');
                });

                it('should trigger his str buff reaction', function () {
                    expect(this.randyll.getStrength()).toBe(7);
                    expect(this.player1).toHavePrompt('Any reactions?');
                    expect(this.randyll.kneeled).toBe(true);
                    this.player1.clickCard(this.randyll);
                    expect(this.randyll.kneeled).toBe(false);
                });
            });
        });
    });
});
