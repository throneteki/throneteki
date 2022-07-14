describe('end of round timings', function () {
    integration(function () {
        describe('Condemned to the Moon Door', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', [
                    'Condemned to the Moon Door', 'Winterfell Steward'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.steward = this.player1.findCardByName('Winterfell Steward', 'hand');
                this.player1.clickCard(this.steward);

                this.completeSetup();
                this.selectFirstPlayer(this.player1);
                this.player1.clickPrompt('player1 - Condemned to the Moon Door');
                this.player1.clickCard(this.steward);
                this.player2.clickCard(this.steward);
                this.completeMarshalPhase();
            });

            it('should trigger at the end of a round', function () {
                expect(this.steward.location).toBe('play area');
                this.completeChallengesPhase();
                expect(this.steward.location).toBe('dead pile');
            });
        });
    });
});
