describe('Isle of Ravens', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Isle of Ravens'] },
            player2: { discard: ['Hedge Knight'] }
        });
        this.player1.clickCard(this.isleOfRavens);
        this.player1.clickCard(this.hedgeKnight);
    });

    it("kneels to shuffle a card from a discard pile into its owner's deck", function () {
        expect(this.isleOfRavens.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
