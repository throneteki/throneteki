describe('"On a Misty Morn"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['"On a Misty Morn"'],
                deadPile: ['Tumblestone Knight', 'Burned Men', 'Ser Jaime Lannister (Core)']
            }
        });
        this.player1.clickCard(this.onAMistyMorn);
    });

    it('returns up to 2 non-unique characters from your dead pile to your hand', function () {
        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Done');

        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
