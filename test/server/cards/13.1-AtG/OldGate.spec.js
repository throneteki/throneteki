describe('Old Gate', function () {
    describe('when each character you control is [stark]', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Old Gate', 'Tumblestone Knight']
                }
            });
        });

        it('gives +1 income', function () {
            expect(this.player1Object.getIncome()).toBe(6);
            expect(this.player2Object.getIncome()).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('sacrifices itself to draw 2 cards', function () {
            this.player1.clickMenu(this.oldGate, 'Sacrifice to draw 2 cards');

            expect(this.oldGate.location).toBe('discard pile');
            expect(this.player1Object.hand).toHaveLength(2);
            expect(this.player2Object.hand).toHaveLength(0);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 sacrifices Old Gate and draws 2 cards'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you control a non-[stark] character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Old Gate', 'Hedge Knight']
                }
            });
        });

        it('cannot be used', function () {
            expect(this.player1.actionUnavailableReason(this.oldGate)).toBe('condition');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('outside the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Old Gate', 'Tumblestone Knight']
                }
            });
        });

        it('cannot be used', function () {
            expect(this.player1.actionUnavailableReason(this.oldGate)).toBe('phase');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
