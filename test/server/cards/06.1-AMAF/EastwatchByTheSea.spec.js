describe('Eastwatch-by-the-Sea', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Eastwatch-by-the-Sea'] } });
        expect(this.player1Object.getReserve()).toBe(this.player2Object.getReserve() + 1);
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.eastwatchByTheSea);
    });

    it('raises your reserve by 1, and draws 1 card after the dominance phase begins if your reserve is higher than an opponent', function () {
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
