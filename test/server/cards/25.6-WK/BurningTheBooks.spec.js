describe('Burning the Books', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Burning the Books (WK)'],
                inPlay: [{ card: 'Hedge Knight', power: 1 }]
            },
            player2: {
                inPlay: [
                    {
                        card: 'Winterfell Steward',
                        attachments: ['Little Bird (Core)', 'Noble Lineage']
                    }
                ]
            }
        });
        this.littleBird = this.player2.findCardByName('Little Bird', 'play area');
        this.nobleLineage = this.player2.findCardByName('Noble Lineage', 'play area');
        this.player1.selectPlot('Burning the Books');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player2.clickCard(this.littleBird);
    });

    it('has each opponent discard a non-The Seven attachment they control', function () {
        expect(this.littleBird.location).toBe('discard pile');
    });

    it('lets you discard 1 power from a character you control to initiate the effect again', function () {
        this.player1.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.nobleLineage);
        expect(this.hedgeKnight.power).toBe(0);
        expect(this.nobleLineage.location).toBe('discard pile');
    });
});
