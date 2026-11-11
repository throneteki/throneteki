describe('Syrio Forel', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Syrio Forel', 'Tumblestone Knight'] },
            player2: { inPlay: ['Hot Pie (FFH)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.syrioForel);
        this.player1.clickCard(this.hotPie);
    });

    it('gives a character a military icon and stealth until the end of the phase', function () {
        expect(this.hotPie.hasIcon('military')).toBe(true);
        expect(this.hotPie.hasKeyword('stealth')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
