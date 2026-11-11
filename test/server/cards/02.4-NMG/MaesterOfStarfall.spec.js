describe('Maester of Starfall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Maester of Starfall'] },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickCard(this.maesterOfStarfall);
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Renown');
    });

    it('kneels to have a character lose the chosen keyword until the end of the phase', function () {
        expect(this.maesterOfStarfall.kneeled).toBe(true);
        expect(this.khalDrogo.hasKeyword('renown')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
