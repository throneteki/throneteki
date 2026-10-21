describe('The White Swords', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['The White Swords'], hand: ['Ser Arys Oakheart (FUtG)'] }
        });
        this.player1.selectPlot('The White Swords');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('may put a Kingsguard character into play from your hand or discard pile', function () {
        this.player1.clickCard(this.serArysOakheart);

        expect(this.serArysOakheart.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
