describe('Battle on the Green Fork (TTS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Battle on the Green Fork (TTS)',
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
        this.player1.triggerAbility(this.battleOnTheGreenFork);
    });

    it('raises its claim by 1 until the end of the phase after you win a challenge as the attacker', function () {
        expect(this.battleOnTheGreenFork.getClaim()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
