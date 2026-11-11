describe('Eddard Stark (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Eddard Stark (Core)', kneeling: true }] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.eddardStark);
    });

    it('stands after a challenge is initiated against you', function () {
        expect(this.eddardStark.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
