describe('Yoren (TB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'thenightswatch', hand: ['Yoren (TB)'], gold: 6 },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickCard(this.yoren);
        this.player1.triggerAbility(this.yoren);
        this.player1.clickCard(this.burnedMen);
    });

    it('takes control of a character with printed cost 5 or lower until he leaves play after he enters play', function () {
        expect(this.burnedMen.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
