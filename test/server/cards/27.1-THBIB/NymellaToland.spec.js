describe('Nymella Toland', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Nymella Toland', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.nymellaToland);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('removes a character attacking alone from the challenge', function () {
        expect(this.tumblestoneKnight.isParticipating()).toBe(false);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });
});
