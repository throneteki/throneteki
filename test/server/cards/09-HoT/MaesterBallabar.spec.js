describe('Maester Ballabar', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Maester Ballabar', 'Tumblestone Knight'] },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.maesterBallabar);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to stand the participating character with the lowest STR and remove it from the challenge', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.tumblestoneKnight.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
