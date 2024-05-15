describe('Sansa Stark (Core)', function () {
    integration(function () {
        describe('when setup', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', ['A Noble Cause', 'Sansa Stark (Core)']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.sansa = this.player1.findCardByName('Sansa Stark', 'hand');

                this.player1.clickCard(this.sansa);
                this.completeSetup();
            });

            it('is setup standing', function () {
                expect(this.sansa.location).toBe('play area');
                expect(this.sansa.kneeled).toBe(false);
            });
        });

        describe('when marshalling', function () {
            beforeEach(function () {
                const deck = this.buildDeck('baratheon', ['A Noble Cause', 'Sansa Stark (Core)']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.sansa = this.player1.findCardByName('Sansa Stark', 'hand');

                this.completeSetup();
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.sansa);
            });

            it('enters play knelt', function () {
                expect(this.sansa.location).toBe('play area');
                expect(this.sansa.kneeled).toBe(true);
            });
        });
    });
});
