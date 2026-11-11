describe('Ser Willam Wells (TIC)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Willam Wells (TIC)', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.serWillamWells);
    });

    it('kills himself to make a character lose a military, an intrigue and a power icon', function () {
        this.player1.clickCard(this.burnedMen);

        expect(this.serWillamWells.location).toBe('dead pile');
        expect(this.burnedMen.hasIcon('military')).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
