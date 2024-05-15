describe('pillage', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('stark', [
                'Trading with the Pentoshi',
                'Wildling Horde',
                'Wildling Horde'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.skipSetupPhase();

            this.selectFirstPlayer(this.player1);

            // Resolve plot order
            this.selectPlotOrder(this.player1);

            [this.wildlingHorde1, this.wildlingHorde2] =
                this.player1.filterCardsByName('Wildling Horde');

            this.player1.clickCard(this.wildlingHorde1);
            this.player1.clickCard(this.wildlingHorde2);
            this.completeMarshalPhase();

            // Return cards to deck
            for (const card of this.player2Object.hand) {
                this.player2Object.moveCard(card, 'draw deck');
            }
        });

        describe('when more than one pillage occurs', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.wildlingHorde1);
                this.player1.clickCard(this.wildlingHorde2);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');

                // Choose order for pillage
                this.player1.clickCard(this.wildlingHorde1);
                this.player1.clickCard(this.wildlingHorde2);
                this.player1.clickPrompt('Done');
            });

            it('should discard two cards', function () {
                expect(this.player2Object.drawDeck.length).toBe(0);
                expect(this.player2Object.discardPile.length).toBe(2);
            });
        });
    });
});
