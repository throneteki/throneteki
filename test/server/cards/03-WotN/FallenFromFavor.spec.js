describe('Fallen from Favor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Fallen from Favor'],
                inPlay: ['Tumblestone Knight', 'Winterfell Steward']
            }
        });
        this.player1.selectPlot('Fallen from Favor');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('sacrifices a character you control when revealed', function () {
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
