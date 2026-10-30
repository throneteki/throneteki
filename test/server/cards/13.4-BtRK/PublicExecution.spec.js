describe('Public Execution', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'baratheon', hand: ['Public Execution'], gold: 3 },
            player2: { inPlay: [{ card: 'Tumblestone Knight', kneeling: true }] }
        });
        this.player1.clickCard(this.publicExecution);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kills a kneeling character', function () {
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
