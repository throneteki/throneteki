describe('Northern Rookery', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                hand: ['Northern Rookery'],
                drawDeck: ['Hot Pie (FFH)'],
                gold: 2
            }
        });
        this.player1.clickCard(this.northernRookery);
        this.player1.triggerAbility(this.northernRookery);
    });

    it('draws 1 card after you marshal it, and raises your reserve by 1', function () {
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
