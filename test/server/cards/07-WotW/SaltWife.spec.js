describe('Salt Wife', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Salt Wife', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.saltWife);
        this.player1.clickCard(this.burnedMen);
    });

    it('sacrifices herself to stop a character being declared as a defender this phase', function () {
        expect(this.saltWife.location).toBe('discard pile');
        expect(this.burnedMen.allowGameAction('declareAsDefender')).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
