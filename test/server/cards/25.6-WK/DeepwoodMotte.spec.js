describe('Deepwood Motte (WK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['The Winds of Winter'], inPlay: ['Deepwood Motte (WK)'] },
            player2: { inPlay: ['Casterly Rock (Core)'] }
        });
        this.player1.selectPlot('The Winds of Winter');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.deepwoodMotte);
    });

    it('kneels to kneel another non-limited location after a Winter plot is revealed', function () {
        expect(this.player1).not.toBeAbleToSelect(this.deepwoodMotte);

        this.player1.clickCard(this.casterlyRock);

        expect(this.casterlyRock.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
