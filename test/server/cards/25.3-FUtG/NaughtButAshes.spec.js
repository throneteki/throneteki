describe('Naught but Ashes (FUtG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight'],
                shadows: ['Naught but Ashes (FUtG)', 'Catspaw'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.naughtButAshes);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gives a participating character without attachments -1 STR for each card in shadows until the end of the phase', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
