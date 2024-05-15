describe('Prized keyword', function () {
    integration(function () {
        describe('when a Prized card leaves play', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'Marched to the Wall',
                    'A Noble Cause',
                    'Aloof and Apart',
                    'Doran Martell (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.prizedCharacter = this.player1.findCardByName('Doran Martell', 'hand');

                this.player1.clickCard(this.prizedCharacter);

                this.completeSetup();

                expect(this.prizedCharacter.location).toBe('play area');
                expect(this.prizedCharacter.getPrizedValue()).toBe(1);

                this.player1.selectPlot('Marched to the Wall');
                this.player2.selectPlot('A Noble Cause');

                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.prizedCharacter);
            });

            it('has opponents gain the prized amount of power', function () {
                expect(this.prizedCharacter.location).toBe('discard pile');
                expect(this.player2Object.getTotalPower()).toBe(1);
            });
        });

        describe('when a Prized event is played', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('stark', ['A Noble Cause', 'Heads on Pikes']);
                const deck2 = this.buildDeck('stark', [
                    'A Noble Cause',
                    { name: 'Hedge Knight', count: 40 }
                ]);

                this.player1.togglePromptedActionWindow('dominance', true);

                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.prizedEvent = this.player1.findCardByName('Heads on Pikes', 'hand');

                const character = this.player2.findCardByName('Hedge Knight', 'hand');
                this.player2.dragCard(character, 'dead pile');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();
                this.player1.clickCard('Heads on Pikes', 'hand');
            });

            it('has opponents gain the prized amount of power', function () {
                expect(this.prizedEvent.location).toBe('discard pile');
                expect(this.player2Object.getTotalPower()).toBe(2);
            });
        });
    });
});
