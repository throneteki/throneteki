describe("King's Gate", function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ["King's Gate"] } });
    });

    it('raises your income by 1', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe("King's Gate", function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ["King's Gate"], power: 5 } });
        this.player1.clickCard(this.kingsGate);
    });

    it('sacrifices itself to draw 2 cards while you have 5 or more power', function () {
        expect(this.kingsGate.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
