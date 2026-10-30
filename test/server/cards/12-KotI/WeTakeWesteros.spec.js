describe('We Take Westeros! (KotI)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { faction: 'greyjoy', plotDeck: ['We Take Westeros! (KotI)', 'Filler Plot'] },
            player2: { discard: ['Sweet Cersei'] }
        });
        this.player1.selectPlot('We Take Westeros!');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.sweetCersei);
    });

    it('puts a location from a discard pile into play under your control when revealed', function () {
        expect(this.sweetCersei.location).toBe('play area');
        expect(this.sweetCersei.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
