describe('The White Book', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'The White Book', inPlay: ['Ser Rolly Duckfield (BtB)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.serRollyDuckfield);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('The White Book');
    });

    it('kneels your faction card to stand each defending Kingsguard character after you win', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.serRollyDuckfield.kneeled).toBe(false);
    });
});
