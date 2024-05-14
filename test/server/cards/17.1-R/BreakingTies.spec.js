describe('Breaking Ties', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('martell', ['Breaking Ties (R)', 'Loreza Sand']);
            const deck2 = this.buildDeck('martell', ['A Noble Cause', 'House Dayne Knight']);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.loyalCharacter = this.player1.findCardByName('Loreza Sand', 'hand');
            this.breakingTies = this.player1.findCardByName('Breaking Ties');
            this.opponentCharacter = this.player2.findCardByName('House Dayne Knight', 'hand');

            this.player1.clickCard(this.loyalCharacter);
            this.player2.clickCard(this.opponentCharacter);

            this.completeSetup();

            this.selectFirstPlayer(this.player2);

            this.completeMarshalPhase();
        });

        describe('when breaking ties is used', function () {
            beforeEach(function () {
                expect(this.loyalCharacter.location).toBe('play area');
                expect(this.opponentCharacter.location).toBe('play area');
                this.player1.clickMenu(this.breakingTies, 'Return character/location to hand');
                this.player1.clickCard(this.loyalCharacter);
                this.player1.clickCard(this.opponentCharacter);
            });

            it('should shuffle the loyal character back into the deck', function () {
                expect(this.loyalCharacter.location).toBe('draw deck');
                expect(this.opponentCharacter.location).toBe('hand');
            });
        });
    });
});
