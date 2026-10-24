describe('The Water Gardens', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['The Water Gardens'],
                hand: ['Sunspear (Core)'],
                usedPlots: ['A Noble Cause', 'Sneak Attack']
            }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.theWaterGardens);
        this.player1.clickCard(this.sunspear);
    });

    it('reduces the cost of your next non-character card by the number of plots in your used pile', function () {
        expect(this.theWaterGardens.kneeled).toBe(true);
        expect(this.sunspear.location).toBe('play area');
        expect(this.player1Object.gold).toBe(this.startingGold);
        expect(this.player1).isReadyToTakeAction();
    });
});
