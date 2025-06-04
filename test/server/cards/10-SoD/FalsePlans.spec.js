describe('False Plans', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('martell', [
                'A Noble Cause',
                'False Plans',
                'House Dayne Knight'
            ]);
            const deck2 = this.buildDeck('martell', [
                'A Noble Cause',
                'Heads on Spikes',
                'House Dayne Knight',
                'House Dayne Knight',
                'Vengeance for Elia'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('House Dayne Knight', 'hand');
            this.opponentCharacter = this.player2.findCardByName('House Dayne Knight', 'hand');

            this.player1.clickCard(this.character);
            this.player2.clickCard(this.opponentCharacter);

            this.completeSetup();
        });

        describe('when False Plans is discarded normally', function () {
            beforeEach(function () {
                this.player2.selectPlot('Heads on Spikes');
                this.selectFirstPlayer(this.player1);
            });

            it('should not activate', function () {
                expect(this.player1Object.hand.length).toBe(0);
                expect(this.player1Object.discardPile.length).toBe(1);
                expect(this.player1).not.toAllowAbilityTrigger('False Plans');
            });
        });

        describe('when False Plans is discarded by intrigue claim', function () {
            beforeEach(function () {
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player2, 'Intrigue', 'House Dayne Knight');
                this.player2.clickPrompt('Apply Claim');

                this.player1.triggerAbility('False Plans');
            });

            it('should discard 2 cards from the opponent', function () {
                expect(this.player2Object.discardPile.length).toBe(2);
            });

            it('should not cost anything', function () {
                expect(this.player1Object.gold).toBe(5);
            });
        });

        describe('vs Vengeance for Elia', function () {
            beforeEach(function () {
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player1, 'Intrigue', 'House Dayne Knight');
                this.player1.clickPrompt('Apply Claim');

                // Redirect the intrigue claim
                this.player2.triggerAbility('Vengeance for Elia');
            });

            it('should not prompt for False Plans', function () {
                expect(this.player1).not.toAllowAbilityTrigger('False Plans');
                expect(this.player1Object.discardPile.length).toBe(1);
            });
        });
    });
});
