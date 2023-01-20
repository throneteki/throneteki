describe('Storm\'s End (BtB)', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('baratheon', [
                'Time of Plenty',
                'Fiery Followers', 'Scheming Septon', 'Storm\'s End (BtB)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.followers = this.player1.findCardByName('Fiery Followers');
            this.stormsEnd = this.player1.findCardByName('Storm\'s End (BtB)');
            this.septon = this.player2.findCardByName('Scheming Septon');

            this.player1.clickCard(this.stormsEnd);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
        });

        describe('when a player initiates a Military challenge', function() {
            beforeEach(function() {
                this.player1.dragCard(this.followers, 'play area');
                this.player2.dragCard(this.septon, 'play area');

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.followers);
                this.player1.clickPrompt('Done');
            });

            it('should have an initiated challenge type & current challenge type of Military', function() {
                expect(this.game.currentChallenge.initiatedChallengeType).toBe('military');
                expect(this.game.currentChallenge.challengeType).toBe('military');
            })

            it('should allow the attacker to trigger Storm\'s End', function() {
                expect(this.player1).toAllowAbilityTrigger(this.stormsEnd);
            });

            describe('and triggers Storm\'s End', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.stormsEnd);
                    this.player1.clickPrompt('Pass');
                    this.player2.clickPrompt('Pass');
                });

                it('should have an initiated challenge type of Military & a current challenge type of Power', function() {
                    expect(this.game.currentChallenge.initiatedChallengeType).toBe('military');
                    expect(this.game.currentChallenge.challengeType).toBe('power');
                });

                it('should allow defenders with Power icons (and without Military icons) to defend', function() {
                    this.player2.clickCard(this.septon);
                    this.player2.clickPrompt('Done');
                    expect(this.game.currentChallenge.defenders).toContain(this.septon);
                });
            });

        });
    });
});
