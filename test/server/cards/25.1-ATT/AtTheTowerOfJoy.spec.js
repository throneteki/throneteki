describe('At the Tower of Joy (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['At the Tower of Joy (ATT)'], inPlay: ['Tumblestone Knight'] }
        });
        this.player1.selectPlot('At the Tower of Joy');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('makes a character unkillable until you reveal a new plot', function () {
        expect(this.tumblestoneKnight.allowGameAction('kill')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
