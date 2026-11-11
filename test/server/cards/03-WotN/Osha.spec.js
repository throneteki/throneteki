describe('Osha', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Osha'] } });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.osha);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.osha);
    });

    it('removes herself from the challenge and stands', function () {
        expect(this.osha.isParticipating()).toBe(false);
        expect(this.osha.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
