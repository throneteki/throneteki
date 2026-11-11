describe('The Shadow City', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['The Shadow City'], hand: ['Catspaw'] }
        });
        this.player1.clickCard(this.catspaw);
        this.player1.clickPrompt('Marshal into shadows');
    });

    it('reduces the cost to marshal your cards into shadows by 1', function () {
        expect(this.catspaw.location).toBe('shadows');
        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('The Shadow City', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Shadow City'], shadows: ['Hot Pie (FFH)'] }
        });
        this.player1.clickCard(this.theShadowCity);
        this.player1.clickCard(this.hotPie);
    });

    it('kneels and discards a card from shadows to draw 2 cards', function () {
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
