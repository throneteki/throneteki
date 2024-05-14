describe('Bronn (CoW)', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('targaryen', ['A Noble Cause', 'Bronn (CoW)']);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.bronn = this.player1.findCardByName('Bronn', 'hand');

            this.player1.clickCard(this.bronn);
            this.completeSetup();

            this.selectFirstPlayer(this.player2);
        });

        it('should allow an opponent to take control', function () {
            this.player2.clickMenu(this.bronn, 'Take control of Bronn');

            expect(this.bronn).toBeControlledBy(this.player2);
        });
    });
});
