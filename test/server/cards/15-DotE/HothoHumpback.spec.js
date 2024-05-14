describe('Hotho Humpback', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('greyjoy', [
                'Wraiths in Their Midst',
                'Hotho Humpback',
                'The High Sparrow',
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

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.hotho = this.player1.findCardByName('Hotho Humpback');
            this.sparrow = this.player1.findCardByName('The High Sparrow');
        });

        describe('when using Hotho', function () {
            beforeEach(function () {
                this.player1.dragCard(this.hotho, 'play area');
                this.completeSetup();
                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();
                expect(this.player1Object.hand.length).toBe(9);
                expect(this.player2Object.hand.length).toBe(9);
            });

            it('should draw a card and then check for reserve', function () {
                this.player1.clickCard(this.hotho);
                this.player1.clickMenu(this.hotho, 'Draw card and check reserve');
                expect(this.player1Object.hand.length).toBe(10);
                expect(this.player2Object.hand.length).toBe(10);
                expect(this.player1).toHavePrompt(
                    'Select 7 cards to discard down to reserve (top first)'
                );
                expect(this.player2).toHavePrompt(
                    'Waiting for opponent to discard down to reserve'
                );
            });
        });

        describe('when using Hotho with a draw restriction in play', function () {
            beforeEach(function () {
                this.player1.dragCard(this.hotho, 'play area');
                this.player1.dragCard(this.sparrow, 'play area');
                this.completeSetup();
                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();
                expect(this.player1Object.hand.length).toBe(9);
                expect(this.player2Object.hand.length).toBe(9);
            });

            it('should draw a card only for one player and then still check for reserve', function () {
                this.player2Object.drawCardsToHand(1);
                //null click to refresh state, else the state of player2Object is not correct
                this.player2.clickCard(this.sparrow);
                expect(this.player1Object.hand.length).toBe(9);
                expect(this.player2Object.hand.length).toBe(10);
                this.player1.clickCard(this.hotho);
                this.player1.clickMenu(this.hotho, 'Draw card and check reserve');
                expect(this.player1Object.hand.length).toBe(10);
                expect(this.player2Object.hand.length).toBe(10);
                expect(this.player1).toHavePrompt(
                    'Select 7 cards to discard down to reserve (top first)'
                );
                expect(this.player2).toHavePrompt(
                    'Waiting for opponent to discard down to reserve'
                );
            });
        });
    });
});
