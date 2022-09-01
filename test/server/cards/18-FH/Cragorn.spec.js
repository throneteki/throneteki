describe('Cragorn', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('greyjoy', [
                'Marching Orders',
                'Cragorn', 'Stony Shore Raider', 'Throwing Axe'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.cragorn = this.player1.findCardByName('Cragorn');
            this.raider = this.player1.findCardByName('Stony Shore Raider');
            this.attachment = this.player1.findCardByName('Throwing Axe');
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('after Cragorn´s action is used', function() {
            beforeEach(function() {
                this.player1.dragCard(this.attachment, 'draw deck');
                this.player1.clickCard(this.cragorn);
                this.player1.clickPrompt('2');
                this.player1.clickCard(this.raider);
                this.player1.clickPrompt('1');
                this.completeMarshalPhase();
                this.player1.clickMenu(this.cragorn, 'Search top 10 cards');
            });

            it('it should search for an attachment', function() {
                expect(this.player1).toHavePrompt('Select card to discard 1 gold');
                this.player1.clickCard(this.cragorn);
                expect(this.player1).toHavePrompt('Select an attachment');
                this.player1.clickCard(this.attachment);
                expect(this.player1).toHavePrompt('Select target for attachment');
                this.player1.clickCard(this.raider);
                expect(this.attachment.location).toBe('play area');
                expect(this.attachment.parent).toBe(this.raider);
            });
        });
    });
});
