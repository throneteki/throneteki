describe('Siege Preparations', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { plot: 'Siege Preparations' } });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.siegePreparations);
    });

    it('draws cards until your hand size equals your reserve during the dominance phase', function () {
        expect(this.player1Object.hand).toHaveLength(6);
        expect(this.player2).isReadyToTakeAction();
    });
});
