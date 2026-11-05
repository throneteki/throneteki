describe('bringing a card out of shadows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'setup',
            player1: { faction: 'targaryen', hand: ['Shadowblack Assassin'] }
        });
        this.player1.clickCard(this.shadowblackAssassin);
        this.player1.clickPrompt('Setup in shadows');
    });

    it('is not offered for a card set up in shadows during setup', function () {
        expect(this.shadowblackAssassin.location).toBe('shadows');
        expect(this.shadowblackAssassin.getCanPlayState(this.player1Object)).toBeFalsy();
    });
});
