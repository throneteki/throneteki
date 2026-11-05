describe('Southron Informant', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Southron Informant'], gold: 1 },
            player2: { hand: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.southronInformant);
    });

    it('gives control of itself to an opponent after it enters play during the challenges phase, then discards 1 card at random from their hand and draws 1 card', function () {
        expect(this.southronInformant.controller).toBe(this.player2Object);
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
