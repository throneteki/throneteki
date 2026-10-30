describe('Darkstar (Km)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Darkstar (Km)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.darkstar);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.darkstar);
        this.player1.clickPrompt('Power');
    });

    it('makes a character it bypasses with stealth lose a challenge icon of your choice', function () {
        expect(this.tumblestoneKnight.hasIcon('power')).toBe(false);
        expect(this.tumblestoneKnight.hasIcon('military')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
