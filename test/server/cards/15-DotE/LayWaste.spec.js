describe('Lay Waste', function() {
    integration(function() {
        describe('when played', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('baratheon', [
                    'Late Summer Feast',
                    'Lay Waste'
                ]);
                const deck2 = this.buildDeck('lannister', [
                    'Marching Orders',
                    'Burned Men',
                    'Widow\'s Wail',
                    'Western Fiefdom',
                    'The Iron Throne (Core)'
                ]);
                this.player1.selectDeck(deck1);
                this.player1.togglePromptedActionWindow('dominance', true);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.burnedMen = this.player2.findCardByName('Burned Men', 'hand');
                this.widowsWail = this.player2.findCardByName('Widow\'s Wail', 'hand');

                this.player2.clickCard(this.burnedMen);
                this.player2.clickCard(this.widowsWail);

                this.completeSetup();

                this.player2.clickCard(this.widowsWail);
                this.player2.clickCard(this.burnedMen);

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                // put western fiefdom back into the deck so it can be searched for
                this.westernFiefdom = this.player2.findCardByName('Western Fiefdom', 'hand');
                this.player2.dragCard(this.westernFiefdom, 'draw deck');
                this.ironThrone = this.player2.findCardByName('The Iron Throne (Core)', 'hand');
                this.player2.dragCard(this.ironThrone, 'draw deck');

                this.completeChallengesPhase();

                this.layWaste = this.player1.findCardByName('Lay Waste', 'hand');
                this.player1.clickCard(this.layWaste);
            });

            it('opens a prompt to choose a target', function() {
                expect(this.player1).toHavePrompt('Select a non-limited location or attachment');
            });

            it('discards the chosen target', function() {
                this.player1.clickCard(this.widowsWail);
                expect(this.widowsWail.location).toBe('discard pile');
            });

            it('after the discard it prompts the owner of the discarded card to search their deck', function() {
                this.player1.clickCard(this.widowsWail);
                expect(this.widowsWail.location).toBe('discard pile');
                expect(this.player2).toHavePrompt('Select a card');
                //first test the iron throne, should not be available
                expect(this.ironThrone.location).toBe('draw deck');
                this.player2.clickCard(this.ironThrone);
                expect(this.ironThrone.location).toBe('draw deck');
                //then test western fiefdom, should be put into play
                expect(this.westernFiefdom.location).toBe('draw deck');
                this.player2.clickCard(this.westernFiefdom);
                expect(this.westernFiefdom.location).toBe('play area');
                expect(this.westernFiefdom.controller).toBe(this.player2Object);
            });
        });
    });
});
