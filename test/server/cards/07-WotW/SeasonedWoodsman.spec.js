describe('Seasoned Woodsman', function () {
    integration(function () {
        describe('when adding an attachment to Seasoned Woodsman', function () {
            beforeEach(function () {
                const deck = this.buildDeck('thenightswatch', [
                    'Sneak Attack',
                    'Seasoned Woodsman',
                    'Little Bird (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Seasoned Woodsman', 'hand');
                this.player1.clickCard(this.character);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickCard('Little Bird', 'hand');
                this.player1.clickCard(this.character);
            });

            it('should allow the ability trigger', function () {
                expect(this.player1).toAllowAbilityTrigger(this.character);
            });
        });
    });
});
