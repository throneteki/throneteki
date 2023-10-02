describe('Azor Ahai Reborn', function() {
    integration(function() {
        describe('when the only other R\'hllor character is remove from the challenge', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'A Noble Cause',
                    'Fiery Followers', 'Maester Wendamyr', 'Azor Ahai Reborn', 'Highgarden (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.rhllor = this.player1.findCardByName('Fiery Followers');
                this.character = this.player1.findCardByName('Maester Wendamyr');
                this.attachment = this.player1.findCardByName('Azor Ahai Reborn');
                this.highgarden = this.player2.findCardByName('Highgarden');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.rhllor);
                this.player2.clickCard(this.highgarden);

                this.completeSetup();

                // Place attachments
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Fiery Followers', 'play area');
                this.player1.clickPrompt('Done');

                this.player1.clickPrompt('Pass');
            });

            it('removes the attached character from the challenge', function() {
                // Remove the declared attacker from the challenge
                this.player2.clickMenu(this.highgarden, 'Remove character from challenge');
                this.player2.clickCard(this.rhllor);

                expect(this.game.currentChallenge.attackers).toEqual([]);
            });
        });

        describe('when Azor Ahai + another Rhllor are declared', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'A Noble Cause',
                    'R\'hllor Infiltrator', 'Selyse Baratheon (Core)', 'Azor Ahai Reborn', 'Highgarden (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.rhllor = this.player1.findCardByName('R\'hllor Infiltrator');
                this.character = this.player1.findCardByName('Selyse Baratheon (Core)');
                this.attachment = this.player1.findCardByName('Azor Ahai Reborn');
                this.highgarden = this.player2.findCardByName('Highgarden');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.rhllor);
                this.player2.clickCard(this.highgarden);

                this.completeSetup();

                // Place attachments
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.character);
                this.player1.clickCard(this.rhllor);
                this.player1.clickPrompt('Done');

                this.player1.clickPrompt('Pass');
            });

            describe('and non-Azor Ahai character is removed', function () {
                beforeEach(function() {
                    this.player2.clickMenu(this.highgarden, 'Remove character from challenge');
                    this.player2.clickCard(this.rhllor);
                });

                it('does not remove Azor Ahai from the challenge', function() {
                    expect(this.game.currentChallenge.attackers).toContain(this.character);
                    expect(this.game.currentChallenge.attackers).not.toContain(this.rhllor);
                });
            });

            describe('and the Azor Ahai character is removed', function () {
                beforeEach(function() {
                    this.player2.clickMenu(this.highgarden, 'Remove character from challenge');
                    this.player2.clickCard(this.character);
                });

                it('adds Azor Ahai back to the challenge', function() {
                    expect(this.game.currentChallenge.attackers).toContain(this.character);
                    expect(this.game.currentChallenge.attackers).toContain(this.rhllor);
                });
            });
        });

        describe('when the character has stealth', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'A Noble Cause',
                    'Fiery Followers', 'Maester Wendamyr', 'Azor Ahai Reborn'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Maester Wendamyr');
                this.attachment = this.player1.findCardByName('Azor Ahai Reborn');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.attachment);
                this.player1.clickCard('Fiery Followers', 'hand');

                // Setup a character that can be bypassed by stealth, otherwise
                // the prompt won't trigger.
                this.player2.clickCard('Fiery Followers', 'hand');

                this.completeSetup();

                // Place attachments
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Fiery Followers', 'play area');
                this.player1.clickPrompt('Done');
            });

            it('does not prompt for stealth', function() {
                expect(this.game.currentChallenge.attackers).toContain(this.character);
                expect(this.player1).not.toHavePrompt('Select stealth target for Maester Wendamyr');
            });
        });
    });
});
