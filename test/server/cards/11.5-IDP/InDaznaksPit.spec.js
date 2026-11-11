describe("In Daznak's Pit", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                shadows: ["In Daznak's Pit"],
                inPlay: [{ card: 'Hedge Knight', kneeling: true }],
                gold: 5
            },
            player2: { inPlay: [{ card: 'Castle Guard', kneeling: true }] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility("In Daznak's Pit");
    });

    it('stands each character and adds another challenges phase when the challenges phase ends', function () {
        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.castleGuard.kneeled).toBe(false);
        expect(this.game.currentPhase).toBe('challenge');
        expect(this.player1).isReadyToTakeAction();
    });
});
