describe('High Septon', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('stark', [
                'A Noble Cause',
                'High Septon',
                'House Tully Septon',
                'Winterfell Steward'
            ]);
            const deck2 = this.buildDeck('targaryen', [
                'A Noble Cause',
                'Mirri Maz Duur',
                'Tears of Lys',
                'Even Handed Justice',
                'His Viper Eyes'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.septon = this.player1.findCardByName('High Septon', 'hand');
            this.sevenCharacter = this.player1.findCardByName('House Tully Septon', 'hand');
            this.nonSevenCharacter = this.player1.findCardByName('Winterfell Steward', 'hand');

            this.player1.clickCard(this.septon);
            this.player1.clickCard(this.sevenCharacter);
            this.player2.clickCard('Mirri Maz Duur');

            this.completeSetup();
        });

        describe('vs a single target ability', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player2, 'intrigue', 'Mirri Maz Duur');
                this.player2.clickPrompt('Pass');
                this.player2.clickPrompt('Apply Claim');

                this.player2.triggerAbility('Mirri Maz Duur');
                this.player2.clickCard(this.septon);
            });

            it('should allow it be redirected to a The Seven character', function () {
                this.player1.triggerAbility('High Septon');
                this.player1.clickCard(this.sevenCharacter);

                expect(this.sevenCharacter.location).toBe('dead pile');
                expect(this.septon.location).not.toBe('dead pile');
            });
        });

        describe('when target resolution is cancelled', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player2, 'intrigue', 'Mirri Maz Duur');
                this.player2.clickPrompt('Pass');
                this.player2.clickPrompt('Apply Claim');

                this.player2.triggerAbility('Mirri Maz Duur');
            });

            it('should not crash', function () {
                expect(() => {
                    // Cancel targeting for Mirri
                    this.player2.clickPrompt('Done');
                }).not.toThrow();
            });
        });

        describe('vs a non-targeting ability', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player2);

                this.player2.clickPrompt('Done');
                this.player1.clickCard(this.nonSevenCharacter);
                this.player1.clickPrompt('Done');

                this.unopposedChallenge(this.player2, 'intrigue', 'Mirri Maz Duur');
                this.player2.triggerAbility('Tears of Lys');
                this.player2.clickCard(this.nonSevenCharacter);
            });

            it('should not allow it be redirected', function () {
                expect(this.player1).not.toAllowAbilityTrigger('High Septon');
            });
        });

        describe('vs a multi target ability', function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player2);

                this.player2.clickCard('Even Handed Justice', 'hand');
                this.player2.clickCard('Mirri Maz Duur');
                this.player2.clickCard(this.septon);
            });

            it('should not allow it be redirected', function () {
                expect(this.player1).not.toAllowAbilityTrigger('High Septon');
            });
        });
    });
});
