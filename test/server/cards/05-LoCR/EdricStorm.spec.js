describe('Edric Storm (LoCR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Edric Storm (LoCR)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.edricStorm);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('stops a character contributing STR to dominance after the dominance phase begins', function () {
        expect(this.tumblestoneKnight.getDominanceStrength()).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
