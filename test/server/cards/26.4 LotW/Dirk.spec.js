describe('Dirk', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: ['Dirk', 'Tumblestone Knight']
            },
            player2: {
                plotDeck: ['Marched to the Wall'],
                inPlay: ['House Maester']
            }
        });

        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Marched to the Wall');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player2.clickCard(this.houseMaester);
        this.player1.clickPrompt('player1 - Dirk - Tumblestone Knight');
    });

    it("places each character discarded from play in its owner's dead pile", function () {
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.houseMaester.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
