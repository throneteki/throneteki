describe('Littlefinger (Core)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Littlefinger (Core)'] } });
    });

    it('raises your income by 1', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Littlefinger (Core)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { hand: ['Littlefinger (Core)'], gold: 5 } });
        this.player1.clickCard(this.littlefinger);
        this.player1.triggerAbility(this.littlefinger);
    });

    it('draws 2 cards after you marshal him', function () {
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
