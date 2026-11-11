describe('Stormlord', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Stormlord', 'Hot Pie (FFH)'] } });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.hotPie);
    });

    it('makes you sacrifice a character after the dominance phase begins if you control no King', function () {
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.stormlord.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
