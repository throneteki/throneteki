describe('Unexpected Return', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                hand: ['Unexpected Return'],
                inPlay: ['Tumblestone Knight'],
                discard: ['Burned Men'],
                gold: 5
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.unexpectedReturn);
        this.player1.clickCard(this.burnedMen);
    });

    it('puts a character from your discard pile into play', function () {
        expect(this.burnedMen.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
