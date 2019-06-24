describe('Azor Ahai Reborn', function() {
    integration(function() {
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
