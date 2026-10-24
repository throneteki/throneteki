describe('Royal Entourage', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'baratheon', inPlay: ['Royal Entourage'] },
            player2: { inPlay: ['Littlefinger (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Intrigue');
        this.player2.clickCard(this.littlefinger);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('kneels itself after you lose an intrigue challenge', function () {
        expect(this.royalEntourage.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
