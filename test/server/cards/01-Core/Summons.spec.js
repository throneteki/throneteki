describe('Summons', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Summons'],
                drawDeck: ['Little Bird (Core)', 'House Dayne Knight']
            }
        });

        this.player1.selectPlot('Summons');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('searches the top 10 cards of your deck for a character and adds it to your hand', function () {
        expect(this.player1).not.toBeAbleToSelect(this.littleBird);

        this.player1.clickCard(this.houseDayneKnight);

        expect(this.houseDayneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
