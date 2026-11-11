describe('Advisor to the Crown', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Advisor to the Crown'], hand: ['Maester Lomys'], gold: 2 }
        });
        this.player1.clickCard(this.advisorToTheCrown);
    });

    it('kneels to reduce the cost of the next Maester character you marshal this phase by 1', function () {
        this.player1.clickCard(this.maesterLomys);

        expect(this.advisorToTheCrown.kneeled).toBe(true);
        expect(this.maesterLomys.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
