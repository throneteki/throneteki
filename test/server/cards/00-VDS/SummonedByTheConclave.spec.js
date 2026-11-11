describe('Summoned by the Conclave', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Summoned by the Conclave'],
                drawDeck: ['House Dayne Knight', 'Tumblestone Knight']
            }
        });

        this.player1.selectPlot('Summoned by the Conclave');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('searches the top 10 cards of your deck for an in-faction card', function () {
        expect(this.player1).not.toBeAbleToSelect(this.houseDayneKnight);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
