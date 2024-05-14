describe('Vengeance for Elia', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                'A Noble Cause',
                'Tywin Lannister (Core)',
                'Hedge Knight'
            ]);
            const deck2 = this.buildDeck('martell', [
                'A Noble Cause',
                'Hedge Knight',
                'Vengeance for Elia'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Tywin Lannister', 'hand');
            this.player2.clickCard('Hedge Knight', 'hand');

            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
        });

        describe('when claim for military is applied', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player1, 'Military', 'Tywin Lannister');
                this.player1.clickPrompt('Apply Claim');

                this.player2.triggerAbility('Vengeance for Elia');
            });

            it('should force the attacker to kill a character', function () {
                this.player1.clickCard('Tywin Lannister', 'play area');

                expect(this.player1Object.deadPile.length).toBe(1);
            });
        });

        describe('when claim for intrigue is applied', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player1, 'Intrigue', 'Tywin Lannister');
                this.player1.clickPrompt('Apply Claim');

                this.player2.triggerAbility('Vengeance for Elia');
            });

            it('should force the attacker to discard from hand', function () {
                expect(this.player1Object.hand.length).toBe(0);
                expect(this.player1Object.discardPile.length).toBe(1);
            });
        });

        describe('when claim for power is applied', function () {
            beforeEach(function () {
                this.game.addPower(this.player1Object, 1);
                this.game.addPower(this.player2Object, 1);

                this.unopposedChallenge(this.player1, 'Power', 'Tywin Lannister');
                this.player1.clickPrompt('Apply Claim');

                this.player2.triggerAbility('Vengeance for Elia');
            });

            it('should force the attacker to transfer power from themself to themself', function () {
                // Player 1: 1 starting power + 1 unopposed + 1 renown + 1 claim - 1 claim
                expect(this.player1Object.getTotalPower()).toBe(3);
                // Player 2: 1 starting power
                expect(this.player2Object.getTotalPower()).toBe(1);
            });
        });
    });
});
