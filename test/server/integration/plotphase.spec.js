describe('plot phase', function() {
    integration(function() {
        describe('when revealing two plots with persistent effects', function() {
            beforeEach(function() {
                const deck = this.buildDeck('targaryen', [
                    'Blood of the Dragon', 'A Song of Summer',
                    'Targaryen Loyalist'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.chud = this.player2.findCardByName('Targaryen Loyalist', 'hand');
                this.player2.clickCard(this.chud);

                this.completeSetup();

                this.player1.selectPlot('Blood of the Dragon');
                this.player2.selectPlot('A Song of Summer');
            });

            it('should apply effects simultaneously', function() {
                // Since Blood of the Dragon and A Song of Summer are applied
                // simultaneously, the chud should survive.
                expect(this.chud.location).toBe('play area');
            });
        });
    });
});
