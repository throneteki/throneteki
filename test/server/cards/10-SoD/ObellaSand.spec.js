describe('Obella Sand', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('martell', [
                'A Noble Cause',
                'Obella Sand',
                'Obella Sand'
            ]);
            const deck2 = this.buildDeck('martell', ['A Noble Cause', 'House Dayne Knight']);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            [this.obella1, this.obella2] = this.player1.filterCardsByName('Obella Sand', 'hand');
            this.opponentCharacter = this.player2.findCardByName('House Dayne Knight', 'hand');

            this.player1.clickCard(this.obella1);
            this.player2.clickCard(this.opponentCharacter);

            this.completeSetup();

            this.selectFirstPlayer(this.player2);

            this.completeMarshalPhase();

            this.player2Object.faction.modifyPower(1);
        });

        describe('when killed by military claim', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player2, 'Military', 'House Dayne Knight');
                this.player2.clickPrompt('Apply Claim');

                this.player1.clickCard(this.obella1);

                this.player1.triggerAbility('Obella Sand');
            });

            it('should shuffle Obella back into the deck', function () {
                expect(this.player1Object.drawDeck).toContain(this.obella1);
            });

            it('should move 1 power', function () {
                expect(this.player1Object.faction.power).toBe(1);
                expect(this.player2Object.faction.power).toBe(1); // 1 initial + 1 unopposed - 1 stolen
            });
        });

        describe('when discarded by intrigue claim', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player2, 'Intrigue', 'House Dayne Knight');
                this.player2.clickPrompt('Apply Claim');

                // This should be a prompt for Obella2, who was in hand
                this.player1.triggerAbility('Obella Sand');
            });

            it('should shuffle Obella back into the deck', function () {
                expect(this.player1Object.drawDeck).toContain(this.obella2);
            });

            it('should move 1 power', function () {
                expect(this.player1Object.faction.power).toBe(1);
                expect(this.player2Object.faction.power).toBe(1); // 1 initial + 1 unopposed - 1 stolen
            });
        });
    });
});
