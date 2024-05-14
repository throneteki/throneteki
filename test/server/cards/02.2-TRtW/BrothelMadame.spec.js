describe('Brothel Madame', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('lannister', [
                'A Noble Cause',
                'Brothel Madame',
                'Brothel Madame',
                'Hedge Knight',
                'Paid Off'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player2.findCardByName('Hedge Knight', 'hand');

            this.player1.clickCard('Brothel Madame', 'hand');
            this.player2.clickCard(this.character);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when the opponent does not pay', function () {
            beforeEach(function () {
                this.completeMarshalPhase();

                this.player1.triggerAbility('Brothel Madame');
                this.player2.clickPrompt('No');

                this.player1.clickPrompt('Done');
            });

            it('should not allow the opponent to initiate military challenges', function () {
                expect(this.player2).toHaveDisabledPromptButton('Military');
            });
        });

        describe('when the opponent pays directly', function () {
            beforeEach(function () {
                this.completeMarshalPhase();

                this.player1.triggerAbility('Brothel Madame');
                this.player2.clickPrompt('Yes');

                this.player1.clickPrompt('Done');
            });

            it('should give the gold to the player', function () {
                expect(this.player1Object.gold).toBe(6);
                expect(this.player2Object.gold).toBe(4);
            });

            it('should allow the opponent to initiate military challenges', function () {
                this.player2.clickPrompt('Military');

                expect(this.player2).toHavePrompt('Select challenge attackers');
            });
        });

        describe('when the opponent pays indirectly', function () {
            beforeEach(function () {
                this.player1.clickCard('Paid Off', 'hand');
                this.player1.clickCard(this.character);
                this.completeMarshalPhase();

                this.player1.triggerAbility('Brothel Madame');
                this.player2.clickPrompt('No');

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Brothel Madame', 'play area');
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.triggerAbility('Paid Off');

                // Pay for Paid Off to re-stand the character
                this.player2.clickPrompt('Yes');

                this.player1.clickPrompt('Apply Claim');
                this.player1.clickPrompt('Done');
            });

            it('should allow the opponent to initiate military challenges', function () {
                this.player2.clickPrompt('Military');

                expect(this.player2).toHavePrompt('Select challenge attackers');
            });
        });

        describe('when there are multiple Brothel Madames', function () {
            beforeEach(function () {
                this.player1.clickCard('Brothel Madame', 'hand');
                this.completeMarshalPhase();
            });

            describe('and the opponent pays for the first one', function () {
                beforeEach(function () {
                    // First Madame
                    this.player1.triggerAbility('Brothel Madame');
                    this.player2.clickPrompt('Yes');

                    // Second Madame
                    this.player1.triggerAbility('Brothel Madame');
                });

                it('should not prompt the opponent to pay again', function () {
                    expect(this.player2).not.toHavePromptButton('Yes');
                    expect(this.player2).not.toHavePromptButton('No');
                });

                it('should allow the opponent to initiate military challenges', function () {
                    this.player1.clickPrompt('Done');
                    this.player2.clickPrompt('Military');

                    expect(this.player2).toHavePrompt('Select challenge attackers');
                });
            });

            describe('and the opponent pays for the second one', function () {
                beforeEach(function () {
                    // First Madame
                    this.player1.triggerAbility('Brothel Madame');
                    this.player2.clickPrompt('No');

                    // Second Madame
                    this.player1.triggerAbility('Brothel Madame');
                    this.player2.clickPrompt('Yes');

                    this.player1.clickPrompt('Done');
                });

                it('should allow the opponent to initiate military challenges', function () {
                    this.player2.clickPrompt('Military');

                    expect(this.player2).toHavePrompt('Select challenge attackers');
                });
            });
        });
    });
});
