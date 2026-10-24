describe('Shadow City Bastard', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Shadow City Bastard', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.shadowCityBastard);
        this.player1.clickCard(this.burnedMen);
    });

    it('sacrifices itself to make a character with printed cost 5 or lower lose a military, an intrigue and a power icon', function () {
        expect(this.shadowCityBastard.location).toBe('discard pile');
        expect(this.burnedMen.hasIcon('military')).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
