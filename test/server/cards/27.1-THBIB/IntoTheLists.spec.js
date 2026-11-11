describe('Into the Lists', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Into the Lists'], inPlay: ['Robb Stark (Core)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.selectPlot('Into the Lists');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.robbStark);
        this.player2.clickCard(this.hedgeKnight);
    });

    it('has each player kneel a military character, then the one with the highest STR gains 2 power', function () {
        expect(this.robbStark.kneeled).toBe(true);
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.robbStark.power).toBe(2);
    });
});
