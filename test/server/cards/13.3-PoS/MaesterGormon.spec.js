describe('Maester Gormon', function () {
    integration(function () {
        describe('playing events from top of deck', function () {
            beforeEach(function () {
                const deck = this.buildDeck('tyrell', [
                    'A Noble Cause',
                    'Maester Gormon',
                    "The Hand's Judgment",
                    'Margaery Tyrell (Core)',
                    'Growing Strong'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.topDeckEvent = this.player1.findCardByName("The Hand's Judgment");
                this.opponentChar = this.player2.findCardByName('Margaery Tyrell');
                this.opponentEvent = this.player2.findCardByName('Growing Strong');

                this.player1.clickCard('Maester Gormon', 'hand');
                this.player2.clickCard(this.opponentChar);

                this.completeSetup();

                this.selectFirstPlayer(this.player2);
                this.completeMarshalPhase();

                // Drag the event to the top of the deck
                this.player1.dragCard(this.topDeckEvent, 'draw deck');
            });

            it('allows the event to be played', function () {
                this.player2.clickCard(this.opponentEvent);
                this.player2.clickCard(this.opponentChar);
                this.player2.clickPrompt('Done');

                expect(this.player1).toAllowAbilityTrigger(this.topDeckEvent);
            });
        });
    });
});
