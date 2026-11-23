describe('Iron Mines (CoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'greyjoy', inPlay: ['Iron Mines (CoW)', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.burnedMen);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.ironMines);
    });

    it('sacrifices itself to save a character that would be killed', function () {
        expect(this.ironMines.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
