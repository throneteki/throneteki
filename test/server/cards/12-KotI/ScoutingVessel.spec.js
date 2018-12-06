describe('Scouting Vessel', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('greyjoy', [
                'Sneak Attack',
                'Black Wind\'s Crew', 'Euron Crow\'s Eye (Core)', 'Scouting Vessel'
            ]);
            const deck2 = this.buildDeck('tyrell', [
                'Sneak Attack',
                { name: 'The Kingsroad', count: 20 }
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.pillager = this.player1.findCardByName('Black Wind\'s Crew', 'hand');
            this.euron = this.player1.findCardByName('Euron Crow\'s Eye', 'hand');
            this.vessel = this.player1.findCardByName('Scouting Vessel', 'hand');

            this.player1.dragCard(this.pillager, 'play area');
            this.player1.clickCard(this.euron);
            this.player1.clickCard(this.vessel);

            this.completeSetup();
            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
        });

        describe('when pillaging with no abilities', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player1, 'Military', this.pillager);
                this.player1.clickPrompt('Apply Claim');
                // No characters for military claim
                this.player2.clickPrompt('Done');

                this.player1.triggerAbility(this.vessel);
            });

            it('discards 3 cards for pillage instead of 1', function () {
                expect(this.player2Object.discardPile.length).toBe(3);
            });
        });

        describe('when pillaging with an abilities', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player1, 'Military', this.euron);
                this.player1.clickPrompt('Apply Claim');
                // No characters for military claim
                this.player2.clickPrompt('Done');

                this.player1.triggerAbility(this.vessel);
            });

            it('triggers for all 3 cards discarded', function () {
                let kingsroads = this.player2.filterCardsByName('The Kingsroad', 'discard pile');

                expect(kingsroads.length).toBe(3);

                for(let card of kingsroads) {
                    this.player1.triggerAbility(this.euron);
                    // Choose card associated with the "discard" event we're triggering
                    this.player1.clickCard(card);
                    // Choose the card to put into play
                    this.player1.clickCard(card);

                    expect(card).toBeControlledBy(this.player1);
                    expect(card.location).toBe('play area');
                }
            });
        });
    });
});
