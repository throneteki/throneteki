describe("Ranger's Cache", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: "Ranger's Cache"
            }
        });

        this.completeChallengesPhase();
        this.player1.triggerAbility(this.rangersCache);
    });

    it('draws 2 cards or gains 3 gold when the taxation phase ends', function () {
        this.player1.clickPrompt('Draw 2 cards');

        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
