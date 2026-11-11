describe('"Dance of the Dragons"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                hand: ['"Dance of the Dragons"'],
                discard: ['Burned Men'],
                gold: 1
            }
        });
        this.player1.clickCard(this.danceOfTheDragons);
        this.player1.clickCard(this.burnedMen);
    });

    it('returns a non-event card with printed cost 3 or lower from your discard pile to your hand', function () {
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
