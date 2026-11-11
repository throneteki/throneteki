describe('Left-Hand Lucas Codd', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Left-Hand Lucas Codd (FH)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.leftHandLucasCodd);
        this.player1.clickPrompt('Done');
    });

    it('places 1 gold from the treasury on a card after no defenders are declared', function () {
        this.player1.clickCard(this.hedgeKnight);
        this.skipActionWindow();
        this.player2.clickPrompt('Done');

        expect(this.player1).toAllowAbilityTrigger(this.leftHandLucasCodd);
        this.player1.triggerAbility(this.leftHandLucasCodd);
        this.player1.clickCard(this.leftHandLucasCodd);

        expect(this.leftHandLucasCodd.gold).toBe(1);

        this.skipActionWindow();
        this.player2.clickCard(this.hedgeKnight);

        expect(this.player1).isReadyToTakeAction();
    });

    it('does not trigger when defenders are declared', function () {
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');

        expect(this.player1).not.toAllowAbilityTrigger(this.leftHandLucasCodd);
    });
});
