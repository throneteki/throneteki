describe('Silent Sisters', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Silent Sisters'],
                deadPile: ['Tumblestone Knight', 'House Maester']
            }
        });
    });

    it('gets +1 STR for each character in your dead pile', function () {
        expect(this.silentSisters.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
