describe('Pyp', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'thenightswatch', inPlay: ['Pyp', 'Ghost (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.pyp);
        this.player1.clickCard(this.ghost);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.pyp);
    });

    it('gives another attacking thenightswatch character insight after he wins a challenge attacking', function () {
        this.player1.clickCard(this.ghost);

        expect(this.ghost.hasKeyword('insight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
