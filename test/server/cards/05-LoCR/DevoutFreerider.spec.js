describe('Devout Freerider', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Devout Freerider']
            }
        });
    });

    it('stops each player gaining gold during the challenges phase', function () {
        expect(this.player1Object.canGainGold()).toBe(false);
        expect(this.player2Object.canGainGold()).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
