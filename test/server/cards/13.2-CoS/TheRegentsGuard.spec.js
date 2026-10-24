describe("The Regent's Guard", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Tumblestone Knight', 'Ser Jaime Lannister (Core)'],
                shadows: ["The Regent's Guard"],
                gold: 0
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theRegentsGuard);
        this.player1.clickCard(this.serJaimeLannister);
    });

    it('returns a lannister non-Ally character with printed cost 4 or higher to your hand to put itself into play from shadows', function () {
        expect(this.serJaimeLannister.location).toBe('hand');
        expect(this.theRegentsGuard.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
