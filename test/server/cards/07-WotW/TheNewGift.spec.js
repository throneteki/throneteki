describe('The New Gift', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['The New Gift', 'Steward at the Wall'], gold: 0 }
        });
        this.player1.clickCard(this.theNewGift);
        this.player1.clickCard(this.stewardAtTheWall);
    });

    it('kneels a Steward character to gain 1 gold during the marshaling phase', function () {
        expect(this.stewardAtTheWall.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('The New Gift', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The New Gift', 'Steward at the Wall'] }
        });
        this.player1.clickCard(this.theNewGift);
        this.player1.clickCard(this.stewardAtTheWall);
    });

    it('kneels a Steward character to draw 1 card during the challenges phase', function () {
        expect(this.stewardAtTheWall.kneeled).toBe(true);
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
