describe('Even Handed Justice', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tumblestone Knight'], hand: ['Even Handed Justice'], gold: 2 },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickCard(this.evenHandedJustice);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
    });

    it('kneels a standing character controlled by each player', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.khalDrogo.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
