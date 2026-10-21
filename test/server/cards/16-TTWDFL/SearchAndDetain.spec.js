describe('Search and Detain', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Search and Detain'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.selectPlot('Search and Detain');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player2);
    });

    it("returns a card without attachments controlled by the first player to its owner's hand", function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
