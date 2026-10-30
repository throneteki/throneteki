describe('Maester Mullin', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Maester Mullin', 'Tumblestone Knight', 'Eddard Stark (Core)'] }
        });
        this.player1.clickCard(this.maesterMullin);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Military');
        this.player1.clickPrompt('Military');
    });

    it('kneels to stop a character being declared as an attacker in challenges of the chosen type this phase', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
        expect(this.player1).toBeAbleToSelect(this.eddardStark);

        this.player1.clickCard(this.eddardStark);
        this.player1.clickPrompt('Done');
        expect(this.player1).isReadyToTakeAction();
    });
});
