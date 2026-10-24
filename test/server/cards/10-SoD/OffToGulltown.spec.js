describe('Off To Gulltown', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Steward at the Wall'],
                hand: ['"Off To Gulltown"'],
                drawDeck: ['Hedge Knight']
            }
        });
        this.player1.clickCard(this.offToGulltown);
        this.player1.clickCard(this.stewardAtTheWall);
    });

    it('gives a character each challenge icon until the end of the phase and draws 1 card', function () {
        expect(this.stewardAtTheWall.hasIcon('military')).toBe(true);
        expect(this.stewardAtTheWall.hasIcon('intrigue')).toBe(true);
        expect(this.stewardAtTheWall.hasIcon('power')).toBe(true);
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
