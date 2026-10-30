describe('Dissension', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Dissension'], gold: 2 },
            player2: { inPlay: ['Winterfell Steward'] }
        });
        this.player1.clickCard(this.dissension);
        this.player1.clickCard(this.winterfellSteward);
    });

    it('discards an Ally character from play', function () {
        expect(this.winterfellSteward.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
