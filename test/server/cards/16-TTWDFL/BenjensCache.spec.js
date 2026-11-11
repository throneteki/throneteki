describe("Benjen's Cache", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ["Benjen's Cache"],
                drawDeck: ['Little Bird (Core)']
            }
        });

        this.player1.selectPlot("Benjen's Cache");
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('searches your deck for a card and adds it to your hand', function () {
        this.player1.clickCard(this.littleBird);

        expect(this.littleBird.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
