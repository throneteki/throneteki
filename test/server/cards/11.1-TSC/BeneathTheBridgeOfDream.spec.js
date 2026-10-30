describe('Beneath the Bridge of Dream', function () {
    function setup(context, usedPlots) {
        context.setupTest({
            phase: 'plot',
            player1: {
                faction: 'lannister',
                shadows: ['Beneath the Bridge of Dream'],
                plotDeck: ['A Noble Cause'],
                usedPlots
            }
        });
        context.player1.triggerAbility('Beneath the Bridge of Dream');
        context.player2.selectPlot('Filler Plot');
    }

    it('shuffles your used pile into your plot deck and reveals a plot at random with +2 gold', function () {
        setup(this, ['Trading with the Pentoshi']);
        expect(this.tradingWithThePentoshi.location).not.toBe('revealed plots');
        const plot = this.player1Object.activePlot;
        expect(['A Noble Cause', 'Trading with the Pentoshi', 'Filler Plot']).toContain(plot.name);
        expect(plot.getIncome()).toBe(plot.cardData.plotStats.income + 2);
    });

    it('still reveals a plot at random when your used pile is empty', function () {
        setup(this, []);
        const plot = this.player1Object.activePlot;
        expect(plot.getIncome()).toBe(plot.cardData.plotStats.income + 2);
    });
});
