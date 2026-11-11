describe('Frey Lordling', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Frey Lordling'] } });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.freyLordling);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.freyLordling);
    });

    it('gets +1 STR until the end of the phase after you initiate a challenge', function () {
        expect(this.freyLordling.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
