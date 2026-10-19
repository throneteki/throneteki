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

    describe('Marshaling Action', function () {
        beforeEach(function () {
            this.setupTest({
                firstPlayer: 'player2',
                player1: { faction: 'lannister', gold: 1, inPlay: ['Bronn (CoW)'] },
                player2: { faction: 'lannister', gold: 1 }
            });
        });

        it('lets an opponent pay 1 gold to take control of Bronn', function () {
            this.player2.clickMenu(this.bronn, 'Take control of Bronn');

            expect(this.bronn).toBeControlledBy(this.player2);
            expect(this.player2.player.gold).toBe(0);
            expect(this.player1.player.cardsInPlay).not.toContain(this.bronn);
            expect(this.player2.player.cardsInPlay).toContain(this.bronn);
            expect(this.player2).isReadyToTakeAction();
        });

        it('cannot be used by the player who already controls Bronn', function () {
            expect(this.player1.actionUnavailableReason(this.bronn)).toBe('noEffect');
            expect(this.player2).isReadyToTakeAction();
        });

        it('cannot be used without 1 gold', function () {
            this.player2.player.gold = 0;

            expect(this.player2.actionUnavailableReason(this.bronn)).toBe('cost');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('outside the marshaling phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { faction: 'lannister', inPlay: ['Bronn (CoW)'] },
                player2: { faction: 'lannister' }
            });
        });

        it('cannot be used', function () {
            expect(this.player2.actionUnavailableReason(this.bronn)).toBe('phase');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
