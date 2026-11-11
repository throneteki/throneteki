describe('Maester Kedry', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Maester Kedry'], hand: ['Confinement'], gold: 0 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.maesterKedry);
    });

    it('kneels to reduce the cost of the next event you play this phase by 2', function () {
        this.player1.clickCard(this.confinement);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.maesterKedry.kneeled).toBe(true);
        expect(this.confinement.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
