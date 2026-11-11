describe('Yoren (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Yoren (R)'], gold: 6 },
            player2: { inPlay: ['Hot Pie (FFH)'] }
        });
        this.player1.clickCard(this.yoren);
        this.player1.triggerAbility(this.yoren);
        this.player2.clickCard(this.hotPie);
    });

    it("takes control of a standing character with printed cost 5 or lower of the opponent's choice after he enters play", function () {
        expect(this.hotPie.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
