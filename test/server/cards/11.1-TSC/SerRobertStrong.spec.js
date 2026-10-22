describe('Ser Robert Strong', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', shadows: ['Ser Robert Strong'], gold: 5 },
            player2: { inPlay: [{ card: 'Tumblestone Knight', kneeling: true }] }
        });
        this.player1.clickCard(this.serRobertStrong);
        this.player1.triggerAbility(this.serRobertStrong);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kills a kneeling character with printed cost 5 or lower after he comes out of shadows', function () {
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
