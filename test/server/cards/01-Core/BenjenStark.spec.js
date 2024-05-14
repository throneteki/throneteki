describe('Benjen Stark', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('thenightswatch', [
                'A Feast for Crows',
                'Benjen Stark',
                'Benjen Stark',
                // Add sufficient cards so that we can test where Benjen ends up
                // within the draw deck after being killed
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight',
                'Hedge Knight'
            ]);
            const deck2 = this.buildDeck('stark', ['A Feast for Crows', 'Summer (Core)']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.benjen = this.player1.findCardByName('Benjen Stark');

            // Ensure at least one copy of Benjen is in hand
            if (this.benjen.location !== 'hand') {
                this.player1.dragCard(this.benjen, 'hand');
            }

            this.player1.clickCard(this.benjen);
            this.player2.clickCard('Summer', 'hand');
            this.completeSetup();
            this.selectFirstPlayer(this.player2);

            this.completeMarshalPhase();
        });

        describe('when Benjen is killed', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player2, 'military', 'Summer');
                this.player2.clickPrompt('Apply Claim');

                this.player1.clickCard(this.benjen);
            });

            it('should allow the player to put Benjen back in the deck', function () {
                this.player1.triggerAbility('Benjen Stark');

                expect(this.benjen.location).toBe('draw deck');
            });

            it('should not prompt twice', function () {
                // Trigger for the one being killed.
                this.player1.triggerAbility('Benjen Stark');

                // Should not prompt again for any copies of Benjen in hand
                expect(this.player1).not.toAllowAbilityTrigger('Benjen Stark');
            });

            it('should not place Benjen on the top of the deck', function () {
                this.player1.mockShuffle((cards) => {
                    // Ensure Benjen always ends up at the bottom of the deck
                    return [...cards].sort((a) => (a.name === 'Benjen Stark' ? 1 : -1));
                });

                this.player1.triggerAbility(this.benjen);

                expect(this.player1Object.drawDeck[0]).not.toBe(this.benjen);
            });
        });
    });
});
