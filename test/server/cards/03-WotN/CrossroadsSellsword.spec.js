describe('Crossroads Sellsword', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Crossroads Sellsword'], gold: 0 },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.crossroadsSellsword);
        this.player1.triggerAbility(this.crossroadsSellsword);
    });

    it('gains 2 gold when it is killed during the challenges phase', function () {
        expect(this.crossroadsSellsword.location).toBe('dead pile');
        expect(this.player1Object.gold).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
