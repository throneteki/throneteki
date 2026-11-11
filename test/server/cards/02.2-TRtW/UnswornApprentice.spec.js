describe('Unsworn Apprentice', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Unsworn Apprentice', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.unswornApprentice);
        this.player1.clickPrompt('Power');
    });

    it('gains a challenge icon of your choice until the end of the phase', function () {
        expect(this.unswornApprentice.hasIcon('power')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
