// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-25: Implement spec for Sentinels of the Realm

describe('Sentinels of the Realm', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('thenightswatch', [
                'Sentinels of the Realm',
                'A Noble Cause',
                'Hedge Knight',
                'Left'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'A Noble Cause',
                'Hedge Knight',
                'Steward at the Wall',
                'Dragonstone Faithful'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.nonGuardDefender = this.player1.findCardByName('Hedge Knight', 'hand');
            this.guardDefender = this.player1.findCardByName('Left', 'hand');

            this.attacker = this.player2.findCardByName('Hedge Knight', 'hand');

            this.player1.clickCard(this.nonGuardDefender);
            this.player1.clickCard(this.guardDefender);

            this.player2.clickCard(this.attacker);
            this.player2.clickCard('Steward at the Wall');
            this.player2.clickCard('Dragonstone Faithful');

            this.completeSetup();

            this.selectFirstPlayer(this.player2);

            // Add cards to be drawn
            this.player1.addCards([{ name: 'Hedge Knight', count: 10 }]);

            this.completeMarshalPhase();
        });

        describe('non-Guard character defending alone', function () {
            beforeEach(function () {
                // Player 2 initiates military challenge
                this.player2.clickPrompt('Military');
                this.player2.clickCard(this.attacker);
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Player 1 defends with non-Guard Hedge Knight alone
                this.player1.clickCard(this.nonGuardDefender);
                this.player1.clickPrompt('Done');
            });

            it('should not contribute strength when defending alone', function () {
                expect(this.nonGuardDefender.getStrength()).toBe(2);
                expect(this.game.currentChallenge.defenderStrength).toBe(0);
            });
        });

        describe('Guard character defending alone', function () {
            beforeEach(function () {
                // Player 2 initiates intrigue challenge
                this.player2.clickPrompt('Military');
                this.player2.clickCard(this.attacker);
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Player 1 defends with Guard alone
                this.player1.clickCard(this.guardDefender);
                this.player1.clickPrompt('Done');
            });

            it('should contribute strength normally', function () {
                expect(this.guardDefender.getStrength()).toBe(2);
                expect(this.game.currentChallenge.defenderStrength).toBe(2);
            });
        });

        describe('end of challenge phase draw', function () {
            describe('when no challenges were initiated against the player', function () {
                beforeEach(function () {
                    // Skip all challenges
                    this.player2.clickPrompt('Done');
                    this.player1.clickPrompt('Done');

                    this.initialHandSize = this.player1Object.hand.length;
                });

                it('should draw 3 cards', function () {
                    this.player1.triggerAbility('Sentinels of the Realm');
                    expect(this.player1Object.hand.length).toBe(this.initialHandSize + 3);
                });
            });

            describe('when one type of challenge was initiated', function () {
                beforeEach(function () {
                    // Player 2 initiates military challenge
                    this.player2.clickPrompt('Military');
                    this.player2.clickCard(this.attacker);
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player2.clickPrompt('Continue');

                    // End challenges
                    this.player2.clickPrompt('Done');
                    this.player1.clickPrompt('Done');

                    this.initialHandSize = this.player1Object.hand.length;
                });

                it('should draw 2 cards', function () {
                    this.player1.triggerAbility('Sentinels of the Realm');
                    expect(this.player1Object.hand.length).toBe(this.initialHandSize + 2);
                });
            });

            describe('when two types of challenges were initiated', function () {
                beforeEach(function () {
                    // Player 2 initiates military challenge
                    this.player2.clickPrompt('Military');
                    this.player2.clickCard(this.attacker);
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();

                    this.player2.clickPrompt('Continue');

                    // Player 2 initiates intrigue challenge
                    this.player2.clickPrompt('Intrigue');
                    this.player2.clickCard('Steward at the Wall');
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();

                    this.player2.clickPrompt('Continue');

                    // End challenges
                    this.player2.clickPrompt('Done');
                    this.player1.clickPrompt('Done');

                    this.initialHandSize = this.player1Object.hand.length;
                });

                it('should draw 1 card', function () {
                    this.player1.triggerAbility('Sentinels of the Realm');
                    expect(this.player1Object.hand.length).toBe(this.initialHandSize + 1);
                });
            });

            describe('when all three types of challenges were initiated', function () {
                beforeEach(function () {
                    // Player 2 initiates military challenge
                    this.player2.clickPrompt('Military');
                    this.player2.clickCard(this.attacker);
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();

                    this.player2.clickPrompt('Continue');

                    // Player 2 initiates intrigue challenge
                    this.player2.clickPrompt('Intrigue');
                    this.player2.clickCard('Steward at the Wall');
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();

                    this.player2.clickPrompt('Continue');

                    // Player 2 initiates power challenge
                    this.player2.clickPrompt('Power');
                    this.player2.clickCard('Dragonstone Faithful');
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();

                    this.player2.clickPrompt('Continue');

                    // End challenges
                    this.player2.clickPrompt('Done');
                    this.player1.clickPrompt('Done');
                });

                it('should not allow triggering the ability', function () {
                    expect(this.player1).not.toAllowAbilityTrigger('Sentinels of the Realm');
                });
            });
        });
    });
});
