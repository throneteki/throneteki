describe('City of Shadows', function () {
    it('returns a card you control with shadow to your hand', function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['City of Shadows (WAID)'], inPlay: ['Nighttime Marauders (R)'] }
        });
        this.player1.selectPlot('City of Shadows');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.nighttimeMarauders);
        expect(this.nighttimeMarauders.location).toBe('hand');
    });

    it('may return it to shadows instead with a City plot in your used pile', function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['City of Shadows (WAID)'],
                usedPlots: ['City of Wealth'],
                inPlay: ['Nighttime Marauders (R)']
            }
        });
        this.player1.selectPlot('City of Shadows');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.nighttimeMarauders);
        this.player1.clickPrompt('Place in shadows');
        expect(this.nighttimeMarauders.location).toBe('shadows');
    });
});
