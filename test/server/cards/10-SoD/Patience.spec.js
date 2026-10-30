describe('Patience', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Hedge Knight', attachments: ['Patience'] }] }
        });
        this.player1.clickMenu(this.patience, 'Return parent to hand');
    });

    it("returns the attached character to its owner's hand", function () {
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.patience.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
