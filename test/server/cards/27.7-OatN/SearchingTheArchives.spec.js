describe('Searching the Archives', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('thenightswatch', [
                'The Conclave',
                'Searching the Archives',
                { name: 'Hedge Knight', count: 20 }
            ]);
            const deck2 = this.buildDeck('lannister', ['A Noble Cause']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.hedgeKnight = this.player1.findCardByName('Hedge Knight', 'hand');

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when using the action', function () {
            beforeEach(function () {
                this.initialHandSize = this.player1Object.hand.length;
                this.player1.clickMenu('Searching the Archives', 'Place a card under your agenda');
            });

            it('should prompt to select a card from hand', function () {
                expect(this.player1).toHavePrompt('Select card to place underneath');
            });

            describe('when a card is selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.hedgeKnight);
                });

                it('should place the card under the agenda', function () {
                    expect(this.hedgeKnight.location).toBe('underneath');
                });

                it('should draw 1 card', function () {
                    // Started with X cards, placed 1 under agenda, drew 1
                    // Net change: same number of cards in hand
                    expect(this.player1Object.hand.length).toBe(this.initialHandSize);
                });
            });
        });
    });

    integration(function () {
        describe('when player has no agenda', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('thenightswatch', [
                    'Searching the Archives',
                    { name: 'Hedge Knight', count: 20 }
                ]);
                const deck2 = this.buildDeck('lannister', ['A Noble Cause']);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
            });

            it('should not allow using the ability', function () {
                let plot = this.player1Object.activePlot;
                expect(this.player1).not.toAllowTriggerAction(
                    plot,
                    'Place a card under your agenda'
                );
            });
        });
    });
});
