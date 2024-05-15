describe('plot phase', function () {
    integration(function () {
        describe('when revealing two plots with persistent effects', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'Blood of the Dragon',
                    'A Song of Summer',
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

            it('should apply effects simultaneously', function () {
                // Since Blood of the Dragon and A Song of Summer are applied
                // simultaneously, the chud should survive.
                expect(this.chud.location).toBe('play area');
            });
        });

        describe('when a new plot is revealed', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'A Song of Summer',
                    'A Noble Cause',
                    'A Noble Cause',
                    'Targaryen Loyalist'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Targaryen Loyalist', 'hand');
                this.player1.clickCard(this.character);

                this.completeSetup();

                this.player1.selectPlot('A Song of Summer');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                expect(this.character.getStrength()).toBe(2);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);
            });

            it('should unapply the effects of the plot', function () {
                expect(this.character.getStrength()).toBe(1);
            });
        });
    });
});
