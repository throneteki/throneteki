describe('Greensight', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                agenda: 'Greensight',
                drawDeck: ['Tumblestone Knight']
            },
            player2: {
                drawDeck: ['House Maester']
            }
        });

        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it("reveals the top card of each player's deck after the draw phase begins, and lets you kneel your faction card to discard them", function () {
        this.player1.clickPrompt('Yes');

        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.houseMaester.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
