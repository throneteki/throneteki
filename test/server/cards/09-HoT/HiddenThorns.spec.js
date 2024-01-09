describe('Hidden Thorns', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('tyrell', [
                'A Noble Cause',
                'Margaery Tyrell (AMAF)', 'The Queen of Thorns (HoT)', 'Hidden Thorns'
            ]);
            const deck2 = this.buildDeck('stark', [
                'A Noble Cause',
                'Hedge Knight', 'Varys (Core)'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('Margaery Tyrell', 'hand');
            this.queenOfThorns = this.player1.findCardByName('The Queen of Thorns', 'hand');
            this.hiddenThorns = this.player1.findCardByName('Hidden Thorns', 'hand');

            this.card1 = this.player2.findCardByName('Hedge Knight', 'hand');
            this.card2 = this.player2.findCardByName('Varys', 'hand');

            this.player1.clickCard(this.character);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when winning a challenge by 5 or more', function() {
            beforeEach(function() {
                this.completeMarshalPhase();

                this.unopposedChallenge(this.player1, 'Intrigue', this.character);
                this.player1.triggerAbility('Hidden Thorns');

                this.player2.clickCard(this.card1);
                this.player2.clickCard(this.card2);
                this.player2.clickPrompt('Done');

                // Skip order of discarded cards
                this.player2.clickPrompt('Done');
            });

            it('should discard the cards', function() {
                expect(this.card1.location).toBe('discard pile');
                expect(this.card2.location).toBe('discard pile');
            });

            it('should place the event in discard', function() {
                expect(this.hiddenThorns.location).toBe('discard pile');
            });
        });

        describe('when the Queen of Thorns is controlled', function() {
            beforeEach(function() {
                this.player1.clickCard(this.queenOfThorns);
                this.completeMarshalPhase();

                this.unopposedChallenge(this.player1, 'Intrigue', this.character);
                this.player1.triggerAbility('Hidden Thorns');

                this.player2.clickCard(this.card1);
                this.player2.clickCard(this.card2);
                this.player2.clickPrompt('Done');
                
                // Skip order of discarded cards
                this.player2.clickPrompt('Done');
            });

            it('should return the event to hand', function() {
                expect(this.hiddenThorns.location).toBe('hand');
            });
        });
    });
});
