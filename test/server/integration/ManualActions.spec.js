describe('manual actions', function() {
    integration(function() {
        describe('when cards cannot enter play', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'Barring the Gates',
                    'Hedge Knight'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.skipSetupPhase();
                this.selectFirstPlayer(this.player1);
            });

            it('should allow them to be dragged into play', function() {
                let card = this.player1.findCardByName('Hedge Knight', 'hand');
                this.player1.dragCard(card, 'play area');

                expect(card.location).toBe('play area');
            });
        });

        describe('when a character is dead', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Arya Stark (Core)', 'Arya Stark (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.skipSetupPhase();
                this.selectFirstPlayer(this.player1);

                [this.character, this.deadCharacter] = this.player1.filterCardsByName('Arya Stark', 'hand');

                this.player1.dragCard(this.deadCharacter, 'dead pile');
            });

            it('should allow them to be dragged into play', function() {
                this.player1.dragCard(this.character, 'play area');

                expect(this.character.location).toBe('play area');
            });
        });
    });
});
