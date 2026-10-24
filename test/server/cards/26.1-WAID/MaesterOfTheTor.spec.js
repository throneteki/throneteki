describe('Maester of the Tor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Maester of the Tor'], drawDeck: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.maesterOfTheTor);
        this.player1.triggerAbility(this.maesterOfTheTor);
    });

    it('places the top card of your deck in shadows after it comes out of shadows', function () {
        expect(this.tumblestoneKnight.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
