describe('At The Gates', function() {
    integration(function() {
        describe('vs Varys Riddle + Gates of the Moon', function() {
            beforeEach(function() {
                const deck = this.buildDeck('targaryen', [
                    'At the Gates', 'Varys\'s Riddle',
                    'Gates of the Moon'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.gates1 = this.player1.findCardByName('Gates of the Moon');
                this.gates2 = this.player2.findCardByName('Gates of the Moon');

                this.completeSetup();

                // Draw the Gates back into the deck
                this.player1.dragCard(this.gates1, 'draw deck');
                this.player2.dragCard(this.gates2, 'draw deck');

                this.player1.selectPlot('At the Gates');
                this.player2.selectPlot('Varys\'s Riddle');
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.player1.clickCard(this.gates1);

                this.player2.clickCard(this.gates2);
            });

            it('modifies income correctly', function() {
                expect(this.player1Object.getTotalIncome()).toBe(7);
                expect(this.player2Object.getTotalIncome()).toBe(8);
            });
        });
    });
});
