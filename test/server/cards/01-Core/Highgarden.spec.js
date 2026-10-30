describe('Highgarden (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Highgarden (Core)'], gold: 1 },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.highgarden);
        this.player1.clickCard(this.khalDrogo);
    });

    it('kneels and pays 1 gold to stand an attacking character and remove it from the challenge', function () {
        expect(this.highgarden.kneeled).toBe(true);
        expect(this.khalDrogo.kneeled).toBe(false);
        expect(this.khalDrogo.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
