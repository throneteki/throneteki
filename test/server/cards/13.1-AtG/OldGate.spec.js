describe('Old Gate', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('stark', [
                'Marching Orders',
                { name: 'Old Gate', count: 20 },
                { name: 'Bran Stark (Core)', count: 20 }
            ]);
            const deck2 = this.buildDeck('stark', [
                'A Noble Cause',
                'Old Gate',
                'Bran Stark (Core)',
                'Hot Pie'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.oldGate1 = this.player1.findCardByName('Old Gate', 'draw deck');
            this.bran1 = this.player1.findCardByName('Bran Stark', 'draw deck');

            this.player1.dragCard(this.oldGate1, 'hand');
            this.player1.dragCard(this.bran1, 'hand');

            this.oldGate2 = this.player2.findCardByName('Old Gate');
            this.bran2 = this.player2.findCardByName('Bran Stark (Core)');
            this.hotpie = this.player2.findCardByName('Hot Pie');

            this.player1.clickCard(this.oldGate1);
            this.player1.clickCard(this.bran1);

            this.player2.clickCard(this.oldGate2);
            this.player2.clickCard(this.bran2);
            this.player2.clickCard(this.hotpie);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
        });

        describe('income is increased by 1', function () {
            it('gold should be 10', function () {
                expect(this.player1Object.gold).toBe(10);
                expect(this.player2Object.gold).toBe(6);
            });
        });

        describe('when there are no Stark characters in play', function () {
            beforeEach(function () {
                this.player1.dragCard(this.bran1, 'discard pile');
            });

            it('does not allow the ability', function () {
                expect(
                    this.player1.hasEnabledMenu(this.oldGate1, 'Sacrifice to draw 2 cards')
                ).toBe(false);
            });
        });

        describe('sacrifice Old Gate to draw 2 cards', function () {
            beforeEach(function () {
                this.player1.clickMenu(this.oldGate1, 'Sacrifice to draw 2 cards');
            });

            it('should move Old Gate to discard pile and 2 cards to hand', function () {
                expect(this.oldGate1.location).toBe('discard pile');
                expect(this.player1Object.hand.length).toBe(11);
            });
        });

        describe('can not sacrifice Old Gate to draw 2 cards with other characters than stark', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
                this.player2.clickMenu(this.oldGate2, 'Sacrifice to draw 2 cards');
            });

            it('should not move Old Gate to discard pile and 0 cards to hand', function () {
                expect(this.oldGate2.location).toBe('play area');
                expect(this.player2Object.hand.length).toBe(0);
            });
        });
    });
});
