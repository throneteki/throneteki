describe('Flea Bottom Bastard', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Flea Bottom Bastard']
            }
        });

        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
    });

    it('gets +3 STR during the dominance phase', function () {
        expect(this.fleaBottomBastard.getStrength()).toBe(4);

        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Pass');

        expect(this.player1).isReadyToTakeAction();
    });
});
