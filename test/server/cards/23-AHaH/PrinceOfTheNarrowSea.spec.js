describe('Prince of the Narrow Sea', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: [
                    { card: 'Salladhor Saan (FotS)', attachments: ['Prince of the Narrow Sea'] },
                    'Wily Smuggler'
                ]
            },
            player2: {
                plotDeck: ['Marching Orders'],
                inPlay: ['Winterfell Steward', 'The Roseroad']
            }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Marching Orders');
        this.selectFirstPlayer(this.player2);
        this.player1.triggerAbility('Prince of the Narrow Sea');
        this.player1.clickCard(this.wilySmuggler);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickCard(this.theRoseroad);
    });

    it('returns a Captain or Smuggler to hand to kneel a cheaper character and location after you lose initiative', function () {
        expect(this.salladhorSaan.hasTrait('Commander')).toBe(true);
        expect(this.wilySmuggler.location).toBe('hand');
        expect(this.winterfellSteward.kneeled).toBe(true);
        expect(this.theRoseroad.kneeled).toBe(true);
    });
});
