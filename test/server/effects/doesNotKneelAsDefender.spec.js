describe('doesNotKneelAsDefender', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('stark', [
                'A Noble Cause',
                'Littlefinger (Core)',
                'Myrcella Baratheon (GoH)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.attacker = this.player1.findCardByName('Littlefinger');
            this.character = this.player2.findCardByName('Myrcella Baratheon');
            this.player1.clickCard(this.attacker);
            this.player2.clickCard(this.character);

            this.completeSetup();
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
        });

        describe('when the character is declared as a defender', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.attacker);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickCard(this.character);
                this.player2.clickPrompt('Done');
            });

            it('should not kneel the character', function () {
                expect(this.game.currentChallenge.isDefending(this.character));
                expect(this.character.kneeled).toBe(false);
            });
        });
    });
});
