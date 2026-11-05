describe('Sunspear (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Sunspear (Core)', 'Tumblestone Knight', 'Castle Guard'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Sunspear');
        this.player1.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
    });

    it('raises your claim by 1 during challenges of the same type this phase', function () {
        expect(this.sunspear.kneeled).toBe(true);
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.player1Object.getClaim()).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
