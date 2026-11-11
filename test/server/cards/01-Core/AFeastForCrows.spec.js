describe('A Feast for Crows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'A Feast for Crows', inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.aFeastForCrows);
    });

    it('gains 2 power for your faction after you win dominance', function () {
        expect(this.player1Object.faction.power).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
