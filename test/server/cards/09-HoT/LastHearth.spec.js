describe('Last Hearth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Last Hearth', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.lastHearth);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to give a participating stark character +3 STR while you have fewer than 3 used plots', function () {
        expect(this.lastHearth.kneeled).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(5);
        expect(this.player2).isReadyToTakeAction();
    });
});
