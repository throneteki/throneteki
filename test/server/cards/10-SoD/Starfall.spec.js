describe('Starfall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Starfall', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.starfall);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Military');
    });

    it('kneels to make a character lose a challenge icon of your choice', function () {
        expect(this.starfall.kneeled).toBe(true);
        expect(this.burnedMen.hasIcon('military')).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
