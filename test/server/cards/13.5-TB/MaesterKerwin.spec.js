describe('Maester Kerwin', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'greyjoy', inPlay: ['Maester Kerwin', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.maesterKerwin);
    });

    it('kills himself to save another character that would be killed', function () {
        expect(this.maesterKerwin.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
