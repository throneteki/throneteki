describe('Thoros of Myr', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Thoros of Myr', power: 1 }, 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.burnedMen);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.thorosOfMyr);
    });

    it('kneels and discards 1 power to save another non-loyal character you control', function () {
        expect(this.thorosOfMyr.kneeled).toBe(true);
        expect(this.thorosOfMyr.power).toBe(0);
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
