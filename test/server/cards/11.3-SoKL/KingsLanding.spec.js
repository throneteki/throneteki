describe("King's Landing (SoKL)", function () {
    integration(function () {
        describe('when marshalling from the discard pile', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    "King's Landing (SoKL)",
                    'The Roseroad',
                    'Winterfell Crypt',
                    'Skagos (IDP)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.location1 = this.player1.findCardByName('The Roseroad');
                this.location2 = this.player1.findCardByName('Winterfell Crypt');
                this.shadowLocation = this.player1.findCardByName('Skagos');

                this.player1.clickCard("King's Landing");
                this.player1.dragCard(this.location1, 'discard pile');
                this.player1.dragCard(this.location2, 'discard pile');
                this.player1.dragCard(this.shadowLocation, 'discard pile');
                this.completeSetup();

                this.selectFirstPlayer(this.player1);
            });

            it('allows a single location to be marshalled', function () {
                this.player1.clickCard(this.location1);

                expect(this.location1.location).toBe('play area');
            });

            it('does not allow more than 1 location per phase', function () {
                this.player1.clickCard(this.location1);
                this.player1.clickCard(this.location2);

                expect(this.location1.location).toBe('play area');
                expect(this.location2.location).toBe('discard pile');
            });

            it('does not allow marshalling into shadows', function () {
                // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/40415-kings-landing-and-shadows-locations/
                // Marshalling a card with specific characteristics is not the
                // same as marshalling a card into shadows.
                this.player1.clickCard(this.shadowLocation);

                expect(this.player1).not.toHavePromptButton('Marshal into shadows');
                expect(this.shadowLocation.location).toBe('play area');
            });
        });
    });
});
