describe('Tithe', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Hot Pie (FFH)'], hand: ['Tithe'], gold: 0 }
        });
        this.player1.clickCard(this.tithe);
        this.player1.clickCard(this.hotPie);
    });

    it('kneels a neutral character to gain 2 gold', function () {
        expect(this.hotPie.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
