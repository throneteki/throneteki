describe('Emissary of the Hightower', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'Trading with the Pentoshi',
                'Margaery Tyrell (AMAF)',
                'The Queen of Thorns (HoT)',
                'Emissary of the Hightower',
                'Growing Strong',
                'Hidden Thorns'
            ]);
            const deck2 = this.buildDeck('stark', [
                'A Noble Cause',
                'Hedge Knight',
                'Varys (Core)'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('Margaery Tyrell', 'hand');
            this.event = this.player1.findCardByName('Growing Strong', 'hand');

            this.player1.dragCard(this.event, 'discard pile');
            this.player1.clickCard(this.character);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when playing an event chosen by Emissary', function () {
            beforeEach(function () {
                this.completeMarshalPhase();

                // Ambush Emissary
                this.player1.clickCard('Emissary of the Hightower', 'hand');
                this.player1.triggerAbility('Emissary of the Hightower');
                this.player1.clickCard(this.event);

                // Play Growing Strong from discard
                this.player1.clickCard(this.event);
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');

                expect(this.character.getStrength()).toBe(7);
            });

            it('should remove the event from the game', function () {
                expect(this.event.location).toBe('out of game');
            });
        });

        describe('vs Hidden Thorns', function () {
            beforeEach(function () {
                this.queenOfThorns = this.player1.findCardByName('The Queen of Thorns', 'hand');
                this.hiddenThorns = this.player1.findCardByName('Hidden Thorns', 'hand');

                this.player1.dragCard(this.hiddenThorns, 'discard pile');
                this.player1.clickCard(this.queenOfThorns);
                this.completeMarshalPhase();

                // Ambush Emissary
                this.player1.clickCard('Emissary of the Hightower', 'hand');
                this.player1.triggerAbility('Emissary of the Hightower');
                this.player1.clickCard(this.hiddenThorns);

                this.unopposedChallenge(this.player1, 'Intrigue', this.character);

                this.player1.triggerAbility('Hidden Thorns');

                this.player2.clickCard('Hedge Knight', 'hand');
                this.player2.clickCard('Varys', 'hand');
                this.player2.clickPrompt('Done');

                // Skip order of discarded cards
                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Apply Claim');
                this.completeChallengesPhase();
            });

            it('should return the event to hand', function () {
                expect(this.hiddenThorns.location).toBe('hand');
            });

            it('should reset the event placement location for future rounds', function () {
                expect(this.hiddenThorns.eventPlacementLocation).toBe('discard pile');
            });
        });
    });
});
