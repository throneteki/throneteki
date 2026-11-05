describe('You Know Nothing (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['You Know Nothing (FtR)'], inPlay: ['Tumblestone Knight'], gold: 1 },
            player2: { inPlay: ['Khal Drogo (Core)', 'Unsullied'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.youKnowNothing);
    });

    it('makes each non-Army character an opponent controls lose all keywords until the end of the phase', function () {
        expect(this.khalDrogo.hasKeyword('renown')).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
