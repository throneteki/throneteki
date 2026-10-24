describe('Vale Refugee', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Vale Refugee'], gold: 2 },
            player2: { inPlay: ['Robb Stark (Core)'] }
        });
        this.completeChallengesPhase();
    });

    it('pays 2 gold to stay in play after not winning dominance', function () {
        this.player1.clickPrompt('Yes');
        expect(this.valeRefugee.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
    });

    it('is discarded otherwise', function () {
        this.player1.clickPrompt('No');
        expect(this.valeRefugee.location).toBe('discard pile');
    });
});
