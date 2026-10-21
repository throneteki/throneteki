describe('Melisandre (NCbT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Melisandre (NCbT)', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('gives participating characters without shadow -1 STR, and places a character with STR 1 or lower in shadows', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(1);

        this.player1.clickCard(this.melisandre);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('shadows');

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });
});
