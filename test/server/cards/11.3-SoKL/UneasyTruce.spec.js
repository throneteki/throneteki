describe('Uneasy Truce', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('Baratheon', ['Uneasy Truce', 'Jon Arryn']);
            const deck2 = this.buildDeck('Targaryen', ['Valar Morghulis']);

            this.player1.selectDeck(deck1);

            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.jon = this.player1.findCardByName('Jon Arryn', 'hand');
            this.player1.clickCard(this.jon);
            this.completeSetup();
            this.selectFirstPlayer(this.player1);
        });

        it('should prevent a player gaining power outside of challenges when the trigger is a multiple-choice action', function () {
            //TODO - rework choices so choices that have no effect are disabled
            this.player1.clickPrompt('Gain 1 Power');
            expect(this.player1Object.getTotalPower()).toBe(0);
            this.player2.clickPrompt('Gain 1 Power');
            expect(this.player2Object.getTotalPower()).toBe(0);
        });
    });
});
