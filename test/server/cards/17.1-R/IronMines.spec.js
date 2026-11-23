describe('Iron Mines (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'greyjoy', inPlay: ['Iron Mines (R)', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.burnedMen);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.ironMines);
    });

    it('kneels and sacrifices itself to save a character that would be killed outside the plot phase', function () {
        expect(this.ironMines.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
