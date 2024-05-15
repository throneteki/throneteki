describe('Red Priest', function () {
    integration(function () {
        describe('when enters play', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('baratheon', ['Marching Orders', 'Red Priest']);
                const deck2 = this.buildDeck('lannister', [
                    'Marching Orders',
                    'Ser Jaime Lannister (Core)',
                    'Burned Men'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.priest = this.player1.findCardByName('Red Priest', 'hand');
                this.player1.clickCard(this.priest);
                this.player1.triggerAbility(this.priest);

                this.card = this.player2.findCardByName('Burned Men');

                this.player1.clickPrompt('Done');
                this.player1.clickCard(this.card);
            });

            it('removes the selected card from the game', function () {
                expect(this.card.location).toBe('out of game');
            });

            it('returns the card if Red Priest leaves play', function () {
                this.player1.dragCard(this.priest, 'discard pile');

                expect(this.card.location).toBe('hand');
            });
        });
    });
});
