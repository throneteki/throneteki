describe('Reznak mo Reznak', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'Marching Orders',
                'Reznak mo Reznak',
                'Hizdahr zo Loraq (R)',
                'Hedge Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.reznak = this.player1.findCardByName('Reznak mo Reznak');
            this.hizdar = this.player1.findCardByName('Hizdahr zo Loraq');
            this.char = this.player1.findCardByName('Hedge Knight');
            this.player1.clickCard(this.hizdar);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('after a character is discard from your hand', function () {
            beforeEach(function () {
                //marshal
                this.player1.clickCard(this.reznak);
                this.player1.clickPrompt('2');
                expect(this.char.location).toBe('hand');
                this.player1.clickMenu(
                    this.hizdar,
                    'Reduce next marshal/ambush/out of shadows cost'
                );
                this.player1.clickCard(this.char);
            });

            it('it should put the character into play when you click yes', function () {
                expect(this.char.location).toBe('discard pile');
                expect(this.reznak.tokens.gold).toBe(2);
                expect(this.player1).toHavePrompt('Any reactions?');
                //trigger reaction
                this.player1.clickCard(this.reznak);
                expect(this.player1).toHavePrompt('Put Hedge Knight into play?');
                this.player1.clickPrompt('Yes');
                expect(this.reznak.tokens.gold).toBe(1);
                expect(this.char.location).toBe('play area');
            });

            it('it should not put the character into play when you click no', function () {
                expect(this.char.location).toBe('discard pile');
                expect(this.reznak.tokens.gold).toBe(2);
                expect(this.player1).toHavePrompt('Any reactions?');
                //trigger reaction
                this.player1.clickCard(this.reznak);
                expect(this.player1).toHavePrompt('Put Hedge Knight into play?');
                this.player1.clickPrompt('No');
                expect(this.reznak.tokens.gold).toBe(3);
                expect(this.char.location).toBe('discard pile');
            });
        });
    });
});
