describe("The Hand's Tourney", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: "The Hand's Tourney", inPlay: ['Hedge Knight'] },
            player2: { inPlay: [{ card: 'Castle Guard', kneeling: true }], power: 2 }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
    });

    it('applies power claim instead of military claim', function () {
        expect(this.castleGuard.location).toBe('play area');
        expect(this.player2Object.faction.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
