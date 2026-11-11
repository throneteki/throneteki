describe('Building Orders', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Building Orders'],
                drawDeck: ['Tumblestone Knight', 'Little Bird (Core)']
            }
        });

        this.player1.selectPlot('Building Orders');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('searches the top 10 cards of your deck for an attachment or location and adds it to your hand', function () {
        expect(this.player1).toBeAbleToSelect(this.littleBird);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.littleBird);

        expect(this.littleBird.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
