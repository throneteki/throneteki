describe('Azor Ahai Reborn', function() {
    integration(function() {
        describe('when the only other R\'hllor character is remove from the challenge', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'A Noble Cause',
                    'Fiery Followers', 'Maester Wendamyr', 'Azor Ahai Reborn', 'Highgarden'
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

        describe('when the only other R\'hllor character is removed from the challenge via a kill effect and the Azor Ahai character is Stannis Baratheon', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'Time of Plenty',
                    'Fiery Followers', 'Stannis Baratheon (FotS)', 'Azor Ahai Reborn', 'Ser Robert Strong'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.rhllor = this.player1.findCardByName('Fiery Followers');
                this.character = this.player1.findCardByName('Stannis Baratheon (FotS)');
                this.attachment = this.player1.findCardByName('Azor Ahai Reborn');
                this.robertStrong = this.player2.findCardByName('Ser Robert Strong');

                this.player1.clickCard(this.character);
                
                this.player2.clickCard(this.robertStrong);
                this.player2.clickPrompt('Setup in shadows');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);
                this.player1.clickCard(this.rhllor);
                
                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Fiery Followers', 'play area');
                this.player1.clickPrompt('Done');

                this.player1.clickPrompt('Pass');

                // Remove the declared attacker from the challenge via ser robert strong
                this.player2.clickCard(this.robertStrong);
                this.player2.triggerAbility(this.robertStrong);
                this.player2.clickCard(this.rhllor);
                //pass actions
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
                //no defenders
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Pass');
            });

            it('removes the attached character from the challenge', function() {
                //in the action window after defenders declared, there should be no attackers left in the challenge
                expect(this.game.currentChallenge.attackers).toEqual([]);
            });
        });

        describe('when the only other R\'hllor character is removed from the challenge via a kill effect and the Azor Ahai character is Stannis Baratheon but Stannis also participating in the challenge as a regular attacker', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'Time of Plenty',
                    'Fiery Followers', 'Stannis Baratheon (FotS)', 'Azor Ahai Reborn', 'Ser Robert Strong'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.rhllor = this.player1.findCardByName('Fiery Followers');
                this.character = this.player1.findCardByName('Stannis Baratheon (FotS)');
                this.attachment = this.player1.findCardByName('Azor Ahai Reborn');
                this.robertStrong = this.player2.findCardByName('Ser Robert Strong');

                this.player1.clickCard(this.character);
                
                this.player2.clickCard(this.robertStrong);
                this.player2.clickPrompt('Setup in shadows');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);
                this.player1.clickCard(this.rhllor);
                
                this.completeMarshalPhase();

                this.player1.clickPrompt('Military');
                this.player1.clickCard('Fiery Followers', 'play area');
                this.player1.clickCard('Stannis Baratheon (FotS)', 'play area');
                this.player1.clickPrompt('Done');

                this.player1.clickPrompt('Pass');

                // Remove the declared attacker from the challenge via ser robert strong
                this.player2.clickCard(this.robertStrong);
                this.player2.triggerAbility(this.robertStrong);
                this.player2.clickCard(this.rhllor);
                //pass actions
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
                //no defenders
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Pass');
            });

            it('does not remove the attached character from the challenge as it is participating as a regular attacker', function() {
                //in the action window after defenders declared, there should be Stannis still participating in the challenge
                expect(this.game.currentChallenge.attackers).toEqual([this.character]);
            });
        });
    });
});
