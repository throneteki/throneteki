describe('Ocean Road', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Ocean Road'], hand: ['Hot Pie (FFH)'], gold: 1 }
        });
        this.player1.clickCard(this.oceanRoad);
    });

    it('kneels to reduce the cost of the next neutral or out-of-faction card you marshal this phase by 1', function () {
        this.player1.clickCard(this.hotPie);

        expect(this.oceanRoad.kneeled).toBe(true);
        expect(this.hotPie.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
