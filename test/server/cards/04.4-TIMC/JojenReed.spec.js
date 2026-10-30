describe('Jojen Reed', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Jojen Reed', kneeling: true }]
            }
        });

        this.completeChallengesPhase();
        this.player1.triggerAbility(this.jojenReed);
    });

    it("reveals the top card of each player's deck after he stands, and has each player draw 1 card", function () {
        this.player1.clickPrompt('Each player draw 1 card');

        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player2Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
