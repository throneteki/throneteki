describe('The Lost Message', function () {
    integration(function () {
        describe('when triggering the action', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', [
                    'The Lost Message',
                    { name: 'The High Sparrow', count: 30 }
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.completeSetup();

                this.plot = this.player1.findCardByName('The Lost Message');

                this.selectFirstPlayer(this.player1);

                // Discard one card so that players don't have the same number
                // of cards in hand.
                this.player2.dragCard(this.player2Object.hand[0], 'discard pile');
            });

            describe('and all players have cards in hand', function () {
                it('shuffles cards into the deck then adds equal amounts back to hand', function () {
                    const player1Hand = [...this.player1Object.hand];
                    const player2Hand = [...this.player2Object.hand];

                    this.player1.clickMenu(this.plot, 'Shuffle cards into deck');

                    expect(this.player1Object.hand.length).toEqual(player1Hand.length);
                    expect(this.player1Object.hand).not.toEqual(player1Hand);
                    expect(this.player2Object.hand.length).toEqual(player2Hand.length);
                    expect(this.player2Object.hand).not.toEqual(player2Hand);
                });
            });

            describe('and there is a limit on the number of cards drawn', function () {
                beforeEach(function () {
                    this.player1.clickCard('The High Sparrow', 'hand');
                });

                it('does not affect the cards added to hand', function () {
                    const player1HandLength = this.player1Object.hand.length;

                    this.player1.clickMenu(this.plot, 'Shuffle cards into deck');

                    expect(this.player1Object.hand.length).toEqual(player1HandLength);
                });
            });

            describe('and any player has no cards in hand', function () {
                beforeEach(function () {
                    for (const card of this.player1Object.hand) {
                        this.player1.dragCard(card, 'discard pile');
                    }
                });

                it('shuffles cards into the deck then adds equal amounts back to hand', function () {
                    const player2Hand = [...this.player2Object.hand];

                    this.player1.clickMenu(this.plot, 'Shuffle cards into deck');

                    expect(this.player1Object.hand).toEqual([]);
                    expect(this.player2Object.hand.length).toEqual(player2Hand.length);
                    expect(this.player2Object.hand).not.toEqual(player2Hand);
                });
            });
        });
    });
});
