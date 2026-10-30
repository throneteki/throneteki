describe('Mare in Heat', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Tumblestone Knight', attachments: ['Mare in Heat'] }] },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.mareInHeat);
        this.player1.clickCard(this.khalDrogo);
    });

    it('kneels to remove a participating character with higher STR from the challenge while the attached character attacks alone', function () {
        expect(this.mareInHeat.kneeled).toBe(true);
        expect(this.khalDrogo.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
