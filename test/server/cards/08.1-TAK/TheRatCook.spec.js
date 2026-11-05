describe('"The Rat Cook"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Steward at the Wall'], hand: ['"The Rat Cook"'], gold: 2 },
            player2: { inPlay: ['Hot Pie (ToJ)'] }
        });
        this.player1.clickCard(this.theRatCook);
        this.player1.clickCard(this.hotPie);
    });

    it('takes control of a character with printed cost up to the number of Stewards you control and blanks it until the end of the round', function () {
        expect(this.hotPie.controller).toBe(this.player1Object);
        expect(this.hotPie.isAnyBlank()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
