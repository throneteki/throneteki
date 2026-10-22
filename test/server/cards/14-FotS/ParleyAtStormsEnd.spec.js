describe("Parley at Storm's End", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ["Parley at Storm's End"], inPlay: ['Tumblestone Knight'] }
        });
        this.player1.selectPlot("Parley at Storm's End");
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Military');
        this.completeMarshalPhase();
    });

    it('stops challenges of the named type being initiated until you reveal a new plot', function () {
        expect(this.player1).toHaveDisabledPromptButton('Military');
        expect(this.player1).not.toHaveDisabledPromptButton('Power');
        expect(this.player1).isReadyToTakeAction();
    });
});
