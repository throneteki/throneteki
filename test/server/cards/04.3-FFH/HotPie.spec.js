describe('Hot Pie (FFH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Hot Pie (FFH)'], hand: ['Bran Stark (Core)'], gold: 1 }
        });
        this.player1.clickCard(this.hotPie);
        this.player1.clickCard(this.hotPie);
    });

    it('kneels a Companion to reduce the cost of the next unique character you marshal this phase by 1', function () {
        this.player1.clickCard(this.branStark);

        expect(this.hotPie.kneeled).toBe(true);
        expect(this.branStark.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
