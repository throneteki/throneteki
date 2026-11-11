describe('Dothraki Honor Guard', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Dothraki Honor Guard'],
                hand: ['Tumblestone Knight', 'House Maester']
            }
        });
    });

    it('gets -1 STR for each card in your hand', function () {
        expect(this.dothrakiHonorGuard.getStrength()).toBe(8);
        expect(this.player1).isReadyToTakeAction();
    });
});
