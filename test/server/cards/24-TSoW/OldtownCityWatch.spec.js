describe('Oldtown City Watch', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { hand: ['Oldtown City Watch'] } });
        this.player1.clickCard(this.oldtownCityWatch);
    });

    it("reveals the top card of each player's deck after it enters play", function () {
        this.player1.triggerAbility(this.oldtownCityWatch);
        expect(this.player1).isReadyToTakeAction();
    });
});
