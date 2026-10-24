describe('Tourney Grounds', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Tourney Grounds'], hand: ['Confinement'], gold: 0 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.tourneyGrounds);
    });

    it('kneels to reduce the cost of the next event you play this phase by 1', function () {
        this.player1.clickCard(this.confinement);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.confinement.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
