describe("Nymeria's Guard", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                hand: ["Nymeria's Guard"],
                inPlay: ['Burned Men', { card: 'Tyene Sand (TS)', kneeling: true }],
                gold: 4
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.nymeriasGuard);
        this.player1.clickCard(this.tyeneSand);
    });

    it('pays 4 gold and stands a Sand Snake to put itself into play from your hand', function () {
        expect(this.tyeneSand.kneeled).toBe(false);
        expect(this.nymeriasGuard.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
