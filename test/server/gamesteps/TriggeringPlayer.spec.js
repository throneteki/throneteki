describe('a triggered ability another player triggers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: [{ card: 'Hedge Knight', attachments: ['Turncloak'] }] },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('is offered to the player its player function picks from the triggering event', function () {
        expect(this.player2).toAllowAbilityTrigger(this.turncloak);
        expect(this.player1).not.toAllowAbilityTrigger(this.turncloak);
    });
});
