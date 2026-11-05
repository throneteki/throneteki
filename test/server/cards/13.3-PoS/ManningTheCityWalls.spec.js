describe('Manning the City Walls (PoS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Manning the City Walls (PoS)', 'Filler Plot'],
                hand: ['Burned Men']
            }
        });
        this.player1.selectPlot('Manning the City Walls');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.burnedMen);
    });

    it('puts a non-unique character with printed cost 3 or lower into play from your hand when revealed', function () {
        expect(this.burnedMen.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
