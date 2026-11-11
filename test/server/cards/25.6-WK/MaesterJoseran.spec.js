describe('Maester Joseran', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                agenda: 'Fealty',
                inPlay: ['Maester Joseran'],
                drawDeck: ['Tumblestone Knight']
            },
            player2: { agenda: 'Fealty', drawDeck: ['Sweet Cersei'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.maesterJoseran);
    });

    it('has each player place the top card of their deck under their agenda after you become the first player', function () {
        expect(this.tumblestoneKnight.location).toBe('underneath');
        expect(this.sweetCersei.location).toBe('underneath');
        expect(this.player1).isReadyToTakeAction();
    });
});
