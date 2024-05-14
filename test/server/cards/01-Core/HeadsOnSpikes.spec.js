describe('Heads on Spikes', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                'Heads on Spikes',
                'Cersei Lannister (LoCR)'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Hedge Knight',
                'Hedge Knight',
                'The Roseroad',
                'The Roseroad'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();
        });

        describe('when a character gets discarded', function () {
            beforeEach(function () {
                // Move non-characters back to draw
                for (const card of this.player2Object.hand) {
                    if (card.getType() !== 'character') {
                        this.player2Object.moveCard(card, 'draw deck');
                    }
                }

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            it('should discard a card from the opponent hand', function () {
                // 1 card discarded, 2 drawn from draw phase
                expect(this.player2Object.hand.length).toBe(3);
            });

            it('should move the opponent character into the dead pile', function () {
                expect(this.player2Object.discardPile.length).toBe(0);
                expect(this.player2Object.deadPile.length).toBe(1);
            });

            it('should gain 2 power for the current player', function () {
                expect(this.player1Object.faction.power).toBe(2);
            });
        });

        describe('when a non-character gets discarded', function () {
            beforeEach(function () {
                // Move characters back to draw
                for (const card of this.player2Object.hand) {
                    if (card.getType() === 'character') {
                        this.player2Object.moveCard(card, 'draw deck');
                    }
                }

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            it('should discard a card from the opponent hand', function () {
                // 1 card discarded, 2 drawn from draw phase
                expect(this.player2Object.hand.length).toBe(3);
            });

            it('should move the opponent character into the discard pile', function () {
                expect(this.player2Object.discardPile.length).toBe(1);
                expect(this.player2Object.deadPile.length).toBe(0);
            });

            it('should not gain power for the current player', function () {
                expect(this.player1Object.faction.power).toBe(0);
            });
        });
    });

    integration(function () {
        describe('vs Missandei', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('lannister', ['Heads on Spikes']);
                const deck2 = this.buildDeck('targaryen', ['Sneak Attack', 'Missandei']);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.missandei = this.player2.findCardByName('Missandei', 'hand');

                this.completeSetup();
                this.selectFirstPlayer(this.player1);

                this.player2.triggerAbility('Missandei');
            });

            it('should not move Missandei from play to the dead pile', function () {
                expect(this.missandei.location).toBe('play area');
            });

            it('should still gain 2 power for the player', function () {
                expect(this.player1Object.getTotalPower()).toBe(2);
            });
        });
    });
});
