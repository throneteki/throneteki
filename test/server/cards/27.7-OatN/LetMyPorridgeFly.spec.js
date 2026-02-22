describe('Let My Porridge Fly', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('arryn', [
                'Let My Porridge Fly',
                'Eddard Stark (Core)',
                'Hedge Knight',
                'The Roseroad'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'A Noble Cause',
                'Tyrion Lannister (Core)',
                'Gold Cloaks',
                'Burned Men'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.eddard = this.player1.findCardByName('Eddard Stark', 'hand');
            this.hedgeKnight = this.player1.findCardByName('Hedge Knight', 'hand');
            this.roseroad = this.player1.findCardByName('The Roseroad', 'hand');

            this.tyrion = this.player2.findCardByName('Tyrion Lannister', 'hand');
            this.goldCloaks = this.player2.findCardByName('Gold Cloaks', 'hand');
            this.burnedMen = this.player2.findCardByName('Burned Men', 'hand');

            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
        });

        describe('when challenge phase begins', function () {
            it('should discard cards with the lowest printed cost from all hands', function () {
                // The Roseroad (cost 0) is the only lowest cost card
                expect(this.roseroad.location).toBe('discard pile');
            });

            it('should not discard cards with higher cost', function () {
                // Hedge Knight (cost 2), Eddard (cost 7), Tyrion (cost 5),
                // Gold Cloaks (cost 4), Burned Men (cost 2) all have higher cost than Roseroad
                expect(this.hedgeKnight.location).toBe('hand');
                expect(this.eddard.location).toBe('hand');
                expect(this.tyrion.location).toBe('hand');
                expect(this.goldCloaks.location).toBe('hand');
                expect(this.burnedMen.location).toBe('hand');
            });
        });
    });

    integration(function () {
        describe('when multiple cards share the lowest cost', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('arryn', [
                    'Let My Porridge Fly',
                    'Hedge Knight',
                    'Hedge Knight',
                    'Hedge Knight'
                ]);
                const deck2 = this.buildDeck('lannister', [
                    'A Noble Cause',
                    'Hedge Knight',
                    'Tyrion Lannister (Core)'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.knights1 = this.player1.filterCardsByName('Hedge Knight', 'hand');
                this.knight2 = this.player2.findCardByName('Hedge Knight', 'hand');
                this.tyrion = this.player2.findCardByName('Tyrion Lannister', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            it('should discard all cards with the lowest cost', function () {
                // Handle the ordering prompt for player1's cards going to discard pile
                // (player2 only has 1 card so no ordering needed)
                this.player1.clickPrompt('Done');

                // All Hedge Knights (cost 2) are the lowest cost and should be discarded
                for (let knight of this.knights1) {
                    expect(knight.location).toBe('discard pile');
                }
                expect(this.knight2.location).toBe('discard pile');
            });

            it('should not discard higher cost cards', function () {
                // Tyrion (cost 5) has higher cost than Hedge Knights (cost 2)
                expect(this.tyrion.location).toBe('hand');
            });
        });
    });

    integration(function () {
        describe('when hands are empty', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('arryn', ['Let My Porridge Fly']);
                const deck2 = this.buildDeck('lannister', ['A Noble Cause']);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                // Discard all cards from hands
                for (let card of [...this.player1Object.hand]) {
                    this.player1Object.moveCard(card, 'discard pile');
                }
                for (let card of [...this.player2Object.hand]) {
                    this.player2Object.moveCard(card, 'discard pile');
                }

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            it('should not cause any errors', function () {
                // Just verify we can proceed to challenge phase
                expect(this.game.currentPhase).toBe('challenge');
            });
        });
    });
});
