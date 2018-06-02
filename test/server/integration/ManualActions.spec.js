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

        describe('when a character cannot be killed', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Hedge Knight', 'The Eyrie'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight', 'hand');

                this.player1.clickCard(this.character);
                this.player1.clickCard('The Eyrie', 'hand');

                this.completeSetup();

                // Prevent the character from being killed
                this.player1.triggerAbility('The Eyrie');
                this.player1.clickCard(this.character);
            });

            it('should allow them to be dragged to the dead pile', function() {
                this.player1.dragCard(this.character, 'dead pile');

                expect(this.character.location).toBe('dead pile');
            });
        });

        describe('when a card cannot be discarded', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'The God\'s Eye'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.card = this.player1.findCardByName('The God\'s Eye', 'hand');

                this.player1.clickCard(this.card);

                this.completeSetup();
            });

            it('should allow it to be dragged to the discard pile', function() {
                this.player1.dragCard(this.card, 'discard pile');

                expect(this.card.location).toBe('discard pile');
            });
        });
    });
});
