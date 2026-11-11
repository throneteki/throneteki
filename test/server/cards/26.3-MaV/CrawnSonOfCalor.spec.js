describe('Crawn Son of Calor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { discard: ['Crawn Son of Calor'], gold: 10 }
        });
        this.player1.clickCard(this.crawnSonOfCalor);
    });

    it('can be marshaled into shadows from your discard pile', function () {
        expect(this.crawnSonOfCalor.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
