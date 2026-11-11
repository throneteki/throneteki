describe('The Goldroad', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['The Goldroad'] } });
    });

    it('raises your income by 1', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('The Goldroad', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['The Goldroad'], gold: 0 } });
        this.player1.clickCard(this.theGoldroad);
    });

    it('kneels to gain 1 gold during the challenges phase', function () {
        expect(this.theGoldroad.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
