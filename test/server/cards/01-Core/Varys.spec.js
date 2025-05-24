describe('Varys (Core)', function () {
    integration(function () {
        describe('simultaneous discard', function () {
            beforeEach(function () {
                const deck = this.buildDeck('thenightswatch', [
                    'A Noble Cause',
                    'Varys (Core)',
                    'Arya Stark (TFM)',
                    'Sansa Stark (Core)',
                    'Sansa Stark (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Varys', 'hand');

                // Explicitly set up a duped Sansa after Arya. If Varys' ability
                // causes Arya to leave play before Sansa instead of
                // simultaneously, the 'cannot be saved' effect will wear off
                // prematurely and Sansa will be saved by her dupe.
                [this.sansa, this.dupe] = this.player2.filterCardsByName('Sansa Stark', 'hand');
                this.player2.clickCard('Arya Stark', 'hand');
                this.player2.clickCard(this.sansa);
                this.player2.clickCard(this.dupe);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.player1.triggerAbility('Varys');
            });

            it('should cause all cards to be discarded simultaneously', function () {
                expect(this.sansa.location).toBe('discard pile');
            });
        });
    });
});
