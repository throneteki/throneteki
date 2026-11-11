describe('Ghost (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'thenightswatch', inPlay: ['Ghost (Core)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.ghost);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.ghost);
    });

    it('stops a character it bypasses with stealth being declared as a defender this phase', function () {
        expect(this.tumblestoneKnight.allowGameAction('declareAsDefender')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
