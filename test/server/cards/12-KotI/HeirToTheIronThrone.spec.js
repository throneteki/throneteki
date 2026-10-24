describe('Heir to the Iron Throne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Heir to the Iron Throne'],
                inPlay: ['Ser Jaime Lannister (Core)'],
                drawDeck: ['Cersei Lannister (Core)', 'Tumblestone Knight']
            }
        });
        this.player1.selectPlot('Heir to the Iron Throne');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('searches the top 10 cards for a Lord or Lady and puts it into play, then sacrifices a Lord or Lady', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickCard(this.serJaimeLannister);

        expect(this.cerseiLannister.location).toBe('play area');
        expect(this.serJaimeLannister.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
