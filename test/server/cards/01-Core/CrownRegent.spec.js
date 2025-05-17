describe('Crown Regent', function () {
    integration({ gameFormat: 'melee' }, function () {
        describe('redirecting a challenge', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', ['Trading with the Pentoshi', 'Hedge Knight']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.player3.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player2.clickCard('Hedge Knight', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Resolve plot order
                this.selectPlotOrder(this.player1);
                this.selectPlotOrder(this.player2);

                this.player1.selectTitle('Crown Regent');
                this.player2.selectTitle('Master of Ships');
                this.player3.selectTitle('Master of Whispers');

                this.completeMarshalPhase();

                // Skip challenges for the Crown Regent
                this.player1.clickPrompt('Done');

                this.player2.clickPrompt('Military');
                this.player2.clickPrompt('player1');
                this.player2.clickCard('Hedge Knight', 'play area');
                this.player2.clickPrompt('Done');
            });

            it('allows the challenge to be redirected', function () {
                expect(this.player1).toAllowAbilityTrigger('Crown Regent');
            });

            it('allows the initiating player to choose a player that supports them', function () {
                this.player1.triggerAbility('Crown Regent');
                expect(this.player2).not.toHavePromptButton('player1');
                expect(this.player2).toHavePromptButton('player3');
            });

            it('updates the defending player', function () {
                this.player1.triggerAbility('Crown Regent');
                this.player2.clickPrompt('player3');
                expect(this.game.currentChallenge.defendingPlayer).toBe(this.player3Object);
                expect(this.game.currentChallenge.initiatedAgainstPlayer).toBe(this.player3Object);
            });
        });

        describe('when a challenge involving stealth is redirected', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Hedge Knight',
                    'Maester Wendamyr'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.player3.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.stealthChar = this.player2.findCardByName('Maester Wendamyr');
                this.player1Char = this.player1.findCardByName('Hedge Knight');
                this.player3Char = this.player3.findCardByName('Hedge Knight');

                this.player1.clickCard(this.player1Char);
                this.player2.clickCard(this.stealthChar);
                this.player3.clickCard(this.player3Char);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.selectTitle('Crown Regent');
                this.player2.selectTitle('Master of Ships');
                this.player3.selectTitle('Master of Whispers');

                this.completeMarshalPhase();

                // Skip challenges for the Crown Regent
                this.player1.clickPrompt('Done');

                this.player2.clickPrompt('Power');
                this.player2.clickPrompt('player1');
                this.player2.clickCard(this.stealthChar);
                this.player2.clickPrompt('Done');

                // Bypass Player 1's char with stealth
                this.player2.clickCard(this.player1Char);

                // Redirect the challenge
                this.player1.triggerAbility('Crown Regent');
                this.player2.clickPrompt('player3');
            });

            it('allows the player to choose new stealth targets', function () {
                expect(this.player2).toHavePrompt('Select stealth target for Maester Wendamyr');
            });

            it('only bypasses the new character with stealth', function () {
                this.player2.clickCard(this.player3Char);
                expect(this.player3Char.bypassedByStealth).toBe(true);
                expect(this.player1Char.bypassedByStealth).toBe(false);
            });
        });
    });
});
