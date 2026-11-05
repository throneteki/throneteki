describe('Reinforcements', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Reinforcements', 'Filler Plot'], hand: ['Tumblestone Knight'] }
        });
        this.player1.selectPlot('Reinforcements');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('puts a character with printed cost 5 or lower into play from your hand or discard pile when revealed', function () {
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
