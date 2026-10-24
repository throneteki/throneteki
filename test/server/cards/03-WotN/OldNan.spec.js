describe('Old Nan', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Old Nan'] },
            player2: { plotDeck: ['A Noble Cause'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('A Noble Cause');
        this.player1.triggerAbility('Old Nan');
        this.player1.clickCard(this.aNobleCause);
        this.player1.clickPrompt('Winter');
    });

    it('kneels when a plot is revealed to give it the Summer or Winter trait until the end of the round', function () {
        expect(this.oldNan.kneeled).toBe(true);
        expect(this.aNobleCause.hasTrait('Winter')).toBe(true);
    });
});
