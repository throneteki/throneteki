describe('Lion Gate', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Lion Gate'] } });
    });

    it('raises your income by 1', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Lion Gate', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Lion Gate'], shadows: ['Hot Pie (FFH)', 'Tumblestone Knight'] }
        });
        this.player1.clickCard(this.lionGate);
    });

    it('sacrifices itself to draw 2 cards while you control 2 or more cards in shadows', function () {
        expect(this.lionGate.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
