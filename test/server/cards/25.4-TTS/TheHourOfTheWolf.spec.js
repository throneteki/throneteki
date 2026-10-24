describe('The Hour of the Wolf (TTS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['The Hour of the Wolf (TTS)'],
                inPlay: ['Tumblestone Knight', 'Grand Maester Pycelle (Core)']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.selectPlot('The Hour of the Wolf (TTS)');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('has each player sacrifice a non-loyal character', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.player2.clickCard(this.burnedMen);

        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.grandMaesterPycelle.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
