describe('The High Sparrow', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['The High Sparrow']
            }
        });
    });

    it('stops each player gaining more than 7 gold or drawing more than 3 cards each round', function () {
        expect(this.player1Object.maxGoldGain.getMax()).toBe(7);
        expect(this.player2Object.maxCardDraw.getMax()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
