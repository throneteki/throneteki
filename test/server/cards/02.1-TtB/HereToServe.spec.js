describe('Here to Serve', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Here to Serve'],
                drawDeck: ['House Maester', 'Tumblestone Knight']
            }
        });

        this.player1.selectPlot('Here to Serve');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('searches your deck for a Maester character with printed cost 3 or lower and puts it into play', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.houseMaester);

        expect(this.houseMaester.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
