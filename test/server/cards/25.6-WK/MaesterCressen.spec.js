describe('Maester Cressen (WK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Fealty',
                shadows: ['Maester Cressen (WK)'],
                drawDeck: ['Tumblestone Knight', 'Sweet Cersei', 'Heart Tree Grove']
            }
        });
        this.player1.clickCard(this.maesterCressen);
        this.player1.triggerAbility(this.maesterCressen);
    });

    it('places the top 2 cards of your deck under your agenda after he comes out of shadows', function () {
        expect(this.tumblestoneKnight.location).toBe('underneath');
        expect(this.sweetCersei.location).toBe('underneath');
        expect(this.heartTreeGrove.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
