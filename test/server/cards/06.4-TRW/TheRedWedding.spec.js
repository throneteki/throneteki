describe('The Red Wedding', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('stark', [
                'The Red Wedding',
                'A Noble Cause',
                'Catelyn Stark (WotN)',
                'Robb Stark (Core)'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('Catelyn Stark', 'hand');
            this.opponentCharacter = this.player2.findCardByName('Robb Stark', 'hand');

            this.player1.clickCard(this.character);
            this.player2.clickCard(this.opponentCharacter);

            this.completeSetup();
            this.player1.selectPlot('The Red Wedding');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
        });

        it('should kill an opponent Lord/Lady when winning challenge', function () {
            this.unopposedChallenge(this.player1, 'Power', this.character);
            this.player1.triggerAbility('The Red Wedding');
            this.player1.clickCard(this.opponentCharacter);

            expect(this.opponentCharacter.location).toBe('dead pile');
        });

        it('should allow the opponent to kill a character when they win a challenge', function () {
            this.player1.clickPrompt('Done');

            this.unopposedChallenge(this.player2, 'Power', this.opponentCharacter);
            this.player2.triggerAbility('The Red Wedding');
            this.player2.clickCard(this.character);

            expect(this.character.location).toBe('dead pile');
        });
    });
});
